import React from 'react';
import classNames from 'classnames';

interface InputGroupProps {
    type: string
    placeholder: string
    error: string | undefined
    isRequired: true
    handleInputChange: (e: any) => void
}

const InputGroup: React.FC<InputGroupProps> = ({
    type,
    placeholder,
    error,
    isRequired,
    handleInputChange,
}) => {
    return (
        <div>
            {isRequired ? <input type={type}
                   className={classNames(
                       'block border border-grey-light w-full p-3 rounded mb-1',
                       {'border-red-500': error}
                   )}
                   placeholder={placeholder}
                   onChange={e => handleInputChange(e)}
                   required
            /> : <input type={type}
                    className={classNames(
                        'block border border-grey-light w-full p-3 rounded mb-1',
                        {'border-red-500': error}
                    )}
                    placeholder={placeholder}
                    onChange={e => handleInputChange(e)}
                /> }
            <small className="font-medium text-red-600">{error}</small>
        </div>
    )
}

export default InputGroup
