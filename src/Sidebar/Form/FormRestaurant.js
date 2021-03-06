import React from 'react'
import Menus from './Menus'
import InputThumb from './InputThumb'

const isAnyLoading = ({ img, menus }) => {
  const all = menus.concat(img)
  return all.some(x => x === true)
}

const FormRestaurant = (props) => {
  const MAX_MENU = 7
  const {
    form,
    errors,
    loading,
    onDelete,
    onClose,
    handleAddMenu,
    handleRemoveMenu,
    handleSubmit,
    handleChangeMenuInput,
    handleChangeMenuImg,
    handleDeleteMenuImg,
    handleChangeInput,
    handleChangeImg,
    handleDeleteImg,
  } = props
  const { name, id, menus, img } = form
  const { name: nameError } = errors
  return (
    <div className="panel panel-default">
      <div className="panel-heading">
        <button disabled={isAnyLoading(loading)} onClick={onClose} className="btn btn-link btn-lg"><i className="fa fa-chevron-left"></i></button>
        <button disabled={isAnyLoading(loading)} form="form-restaurant" type="submit" className="btn btn-link btn-lg primary"><i className="fa fa-check"></i> Simpan</button>
        {onDelete && <button disabled={isAnyLoading(loading)} onClick={() => onDelete(id)} className="btn btn-link btn-lg red"><i className="fa fa-trash-o"></i>&nbsp;Hapus</button>}
      </div>
      <div className="panel-body">
        <form onSubmit={handleSubmit} id="form-restaurant">
          <div className="resto-name">
            <label className={`form-group ${nameError.length ? 'has-error' : ''}`}>
              <input name="name" value={name} onChange={handleChangeInput} placeholder="Nama tempat" />
              {nameError && nameError.map(e => <small key={e} className="help-block">{e}</small>)}
            </label>
          </div>
          <div className="resto-thumb">
            <InputThumb
              id="resto-img"
              src={img.src}
              isLoading={loading.img}
              onChange={handleChangeImg}
              iconPosition="top-right"
              onDelete={handleDeleteImg}
              name="img"
              size="l"
              label="Tambahkan foto lokasi"
            />
          </div>
          <Menus
            loading={loading.menus}
            menus={menus}
            errors={errors.menus}
            handleChangeMenuImg={handleChangeMenuImg}
            handleDeleteMenuImg={handleDeleteMenuImg}
            handleChangeMenuInput={handleChangeMenuInput}
            handleRemoveMenu={handleRemoveMenu}
          />
          {
            menus.length < MAX_MENU && <div className="form-group">
              <button type="button" onClick={handleAddMenu} className="btn btn-block btn-add-menu">
                <i className="fa fa-plus"></i>&nbsp;Tambah menu
              </button>
            </div>
          }
        </form>
      </div>
    </div>
  )
}

export default FormRestaurant
