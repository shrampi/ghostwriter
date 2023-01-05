import React from 'react';

const OptionsMenu = (props) => {
    const [hidden, setHidden] = React.useState(true);
    return (
        <div>
            <button onClick={() => setHidden(!hidden)}>{hidden ? 'Options' : 'Hide Options'}</button>
            {!hidden && <div>{props.children}</div>}
        </div>
    )
}

export default OptionsMenu;