import React from 'react'

const Thumb = ({ id, src, onDelete, onChange, onPreview, isLoading, position = 'center' }) => {
  const pos = ({
    center: '',
    'top-right': 'top-right',
  })[position] || ''

  return (
    <div className="thumb">
      <div className={`loader ${isLoading ? '' : 'hidden'}`}>
        <i className="fa fa-circle-o-notch fa-3x fa-spin"></i>
      </div>
      <div className={`thumb-buttons ${pos} ${isLoading ? 'hidden' : ''}`}>
        <button type="button" onClick={onPreview}><i className="fa fa-eye"></i></button>
        <button type="button">
          <label htmlFor={id}>
            <i className="fa fa-camera"></i>
            <input id={id} type="file" className="hidden" onChange={onChange} />
          </label>
        </button>
        <button type="button" onClick={onDelete}><i className="fa fa-trash"></i></button>
      </div>
      <img className="media-object" src={src} alt="mie ayam" />
    </div>
  )
}

export default Thumb
