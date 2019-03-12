import React, { Component } from 'react';

class Input extends Component {
    render() {
        const { name, type = 'text', value, onchange, label } = this.props;
        return (
            <div className="form-group">
                <label className="form-control-label" htmlFor="new-email">{label}</label>
                <input
                    onChange={onchange}
                    className="form-control"
                    name={name}
                    id={name}
                    type={type}
                    value={value} />
                {false && <div className="form-control-feedback">This input value is valid</div>}
            </div>
        )
    }
}

export default Input;