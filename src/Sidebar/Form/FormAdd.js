import React from 'react'
import validate from './validate'
import { restaurantImgRef } from '../../lib/firebase'
import FormRestaurant from './FormRestaurant'

const MAX_MENU = 7

const readFile = file =>
  new Promise((res, rej) => {
    const reader = new FileReader()
    reader.onload = e => {
      const src = e.target.result
      res(src)
    }
    reader.readAsDataURL(file)
  })

// define init state here, so it can be reused
const initialState = {
  // files to be uploaded
  queues: {
    img: null,
    menus: [],
  },
  form: {
    name: '',
    img: {
      src: '',
      ref: '',
    },
    menus: [],
  },
  errors: {
    name: '',
    menus: [],
  }
}

const menuState = {
  name: '',
  price: '',
  img: {
    src: '',
    ref: '',
  },
}

class FormAdd extends React.Component {
  constructor({ restaurant }) {
    super()
    this.state = {
      ...initialState,
    }

    this.handleChangeImg = this.handleChangeImg.bind(this)
    this.handleChangeInput = this.handleChangeInput.bind(this)
    this.handleChangeMenuInput = this.handleChangeMenuInput.bind(this)
    this.handleChangeMenuImg = this.handleChangeMenuImg.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleAddMenu = this.handleAddMenu.bind(this)
    this.handleRemoveMenu = this.handleRemoveMenu.bind(this)
    this.handleDeleteMenuImg = this.handleDeleteMenuImg.bind(this)
    this.handleDeleteImg = this.handleDeleteImg.bind(this)
  }
  componentWillUpdate(props, nextState) {
    console.log('next state', nextState)
  }
  /* set nested state */
  setNState(field, newState) {
    this.setState(prev => {
      return {
        [field]: {
          ...prev[field],
          ...newState,
        }
      }
    })
  }
  handleChangeInput(e) {
    const { name, value } = e.target
    this.setNState('form', {
      [name]: value,
    })
  }
  handleAddMenu() {
    const menus = this.state.form.menus.concat([menuState])
    const menuQueues = this.state.queues.menus.concat(null)
    if (menus.length <= MAX_MENU) {
      this.setNState('form', { menus })
      this.setNState('queues', { menus: menuQueues })
    }
  }
  handleRemoveMenu = idx => () => {
    this.resetErrors()
    this.setNState('queues', {
      menus: this.state.queues.menus.filter((m, i) => idx !== i),
    })
    this.setNState('form', {
      menus: this.state.form.menus.filter((m, i) => idx !== i),
    })
  }
  handleDeleteImg() {
    this.setNState('queues', {
      img: null,
    })
    this.setNState('form', {
      img: { ref: '', src: '' }
    })
    // const ref = this.state.form.img.ref
    // console.log('deleting img', ref)
    // restaurantImgRef.child(ref).delete().then(_ => {
    //   const img = {
    //     ref: '',
    //     src: '',
    //   }
    //   this.setNState('form', { img })
    // })
  }
  handleDeleteMenuImg = idx => () => {
    this.setNState('queues', {
      menus: this.state.queues.menus.map((m, i) => i === idx ? null : m)
    })
    this.setMenuImgState({
      idx,
      img: { ref: '', src: '', }
    })
  }
  resetErrors(field) {
    this.setState(_ => ({
      errors: { ...initialState.errors }
    }))
  }
  handleChangeImg(e) {
    const input = e.target

    if (!input.files) return

    const file = input.files[0]
    readFile(file).then(src => {
      this.setNState('form', {
        img: { src }
      })
      this.setNState('queues', {
        img: file,
      })
    })
  }
  handleChangeMenuImg = idx => e => {
    const input = e.target
    if (!input.files) return

    const file = input.files[0]
    readFile(file).then(src => {
      this.setMenuImgState({
        idx,
        img: { src },
      })
      this.setNState('queues', {
        menus: this.state.queues.menus.map((m, i) => i === idx ? file : m)
      })
    })
  }
  setMenuImgState({ idx, img }) {
    const menus = this.state.form.menus.map((m, i) => {
      const withImg = {
        ...m,
        img,
      }
      return (i === idx) ? withImg : m
    })
    this.setNState('form', { menus })
  }
  handleChangeMenuInput = (idx, field) => e => {
    const { rawValue, value } = e.target // get raw value from cleave.js
    const menus = this.state.form.menus.map((m, i) => {
      return (i === idx)
        ? { ...m, [field]: rawValue || value }
        : m
    })
    console.log('change menu input', idx, field, menus)
    this.setNState('form', { menus })
  }
  uploadQueues() {
    const uploadImg = file => {
      if (!file) return Promise.resolve()

      const { name } = file
      return restaurantImgRef.child(name).put(file).then(snapshot => {
        const src = snapshot.downloadURL
        const img = {
          src,
          ref: name,
        }
        this.setNState('form', { img })
      })
    }

    const uploadMenuImg = queue => {
      const { idx, file } = queue
      if (!file) return Promise.resolve()

      const { name } = file
      return restaurantImgRef.child(name).put(file).then(snapshot => {
        const src = snapshot.downloadURL
        const img = {
          src,
          ref: name,
        }
        this.setMenuImgState({ idx, img })
      })
    }

    const queues = this.state.queues
    const { img, menus } = queues
    const imgTask = uploadImg(img)
    const menuTasks = menus.map(m => uploadMenuImg(m))

    const ps = [imgTask, ...menuTasks]
    return Promise.all(ps).then(_ => {
      // this will be transformed state
      return this.state.form
    })
  }
  handleSubmit(e) {
    e.preventDefault()
    const { onSubmit } = this.props
    const { form } = this.state
    const { errors, isValid } = validate(form)
    if (isValid) {
      this.uploadQueues().then(onSubmit)
    }
    else {
      this.setState(_ => ({ errors }) )
    }
  }
  render() {
    return (
      <FormRestaurant
        form={this.state.form}
        errors={this.state.errors}
        onDelete={this.props.onDelete}
        onClose={this.props.onClose}
        handleAddMenu={this.handleAddMenu}
        handleRemoveMenu={this.handleRemoveMenu}
        handleSubmit={this.handleSubmit}
        handleChangeMenuInput={this.handleChangeMenuInput}
        handleChangeMenuImg={this.handleChangeMenuImg}
        handleDeleteMenuImg={this.handleDeleteMenuImg}
        handleChangeInput={this.handleChangeInput}
        handleChangeImg={this.handleChangeImg}
        handleDeleteImg={this.handleDeleteImg}
      />
    )
  }
}

export default FormAdd
