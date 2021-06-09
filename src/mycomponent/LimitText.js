import React from 'react';

function LimitText({text , maxlength}) {
    return (
        <div>
            {
                text.length <= maxlength ? text : `${text.substr(0, maxlength).trim()}...`
            }
        </div>
    )
}

export default LimitText
