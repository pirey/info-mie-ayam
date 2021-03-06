import React from 'react'
import validate from './validate'
import FormRestaurant from './FormRestaurant'
import { readFile } from '../../lib/helpers'

const MAX_MENU = 7

// define init state here, so it can be reused
const initialState = {
  // store files to be uploaded onSubmit
  loading: {
    img: false,
    menus: [],
  },
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

const menuItem = {
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
  setMenuState({ idx, ...rest }) {
    const menus = this.state.form.menus.map((m, i) =>
      (i === idx) ? { ...m, ...rest } : m)
    this.setNState('form', { menus })
  }
  resetErrors(field) {
    this.setState(_ => ({
      errors: { ...initialState.errors }
    }))
  }
  handleChangeInput(e) {
    const { name, value } = e.target
    this.setNState('form', {
      [name]: value,
    })
  }
  handleAddMenu() {
    const menus = this.state.form.menus.concat([menuItem])
    const queues = this.state.queues.menus.concat(null)
    const loading = this.state.loading.menus.concat(false)
    if (menus.length <= MAX_MENU) {
      this.setNState('form', { menus })
      this.setNState('queues', { menus: queues })
      this.setNState('loading', { menus: loading })
    }
  }
  handleRemoveMenu = idx => () => {
    this.resetErrors()

    const not = (m, i) => idx !== i
    const menus = this.state.form.menus.filter(not)
    const queues = this.state.queues.menus.filter(not)
    const loading = this.state.loading.menus.filter(not)

    this.setNState('form', { menus })
    this.setNState('queues', { menus: queues })
    this.setNState('loading', { menus: loading })
  }
  handleDeleteImg() {
    this.setNState('queues', {
      img: null,
    })
    this.setNState('form', {
      img: { ref: '', src: '' }
    })
  }
  handleDeleteMenuImg = idx => () => {
    this.setNState('queues', {
      menus: this.state.queues.menus.map((m, i) => i === idx ? null : m)
    })
    this.setMenuState({
      idx,
      img: { ref: '', src: '', }
    })
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
      this.setMenuState({
        idx,
        img: { src },
      })
      this.setNState('queues', {
        menus: this.state.queues.menus.map((m, i) => i === idx ? file : m)
      })
    })
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
  handleUploadQueues() {
    const { onUpload } = this.props

    const uploadImg = file =>
      onUpload(file).then(img =>
        this.setNState('form', { img }))

    const uploadMenuImg = (file, idx) =>
      onUpload(file).then(img =>
        this.setMenuState({ idx, img }))

    const { queues } = this.state
    const { img, menus } = queues
    const imgTask = uploadImg(img)
    const menuTasks = menus.map(uploadMenuImg)

    this.setAllLoading()
    const ps = [imgTask, ...menuTasks]
    return Promise.all(ps).then(_ => {
      // all the images should have their ref and src updated
      return this.state.form
    })
  }
  setAllLoading() {
    this.setNState('loading', {
      img: true,
      menus: this.state.loading.menus.map(_ => true)
    })
  }
  handleSubmit(e) {
    e.preventDefault()
    const { onSubmit } = this.props
    const { form } = this.state
    const { errors, isValid } = validate(form)
    if (isValid) {
      this.handleUploadQueues().then(onSubmit)
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
        loading={this.state.loading}
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
