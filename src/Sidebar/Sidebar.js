import React          from 'react'
import FormEdit       from './Form/FormEdit'
import FormAdd        from './Form/FormAdd'
import Explore        from './Explore'
import * as Modes     from '../modes'

const Sidebar = (props) => {
    const { mode, active, onClose, onResetMode, selectedMarker, onCreateLocation, onRemoveLocation, onUpdateLocation, onSelectionMode, onPartialUpdate } = props
    return (
      <div id="sidebar" className={active ? 'active' : ''}>
        {mode === Modes.EXPLORE && <Explore onInitSelect={onSelectionMode} onClose={onClose} />}
        {mode === Modes.ADD_LOCATION && <FormAdd onSubmit={onCreateLocation} onClose={onResetMode} onPartialUpdate={onPartialUpdate} />}
        {mode === Modes.DETAIL && <FormEdit onSubmit={onUpdateLocation} onDelete={onRemoveLocation} restaurant={selectedMarker} onClose={onResetMode} />}
      </div>
    )
}

export default Sidebar
