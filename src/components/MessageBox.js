import React from 'react';

export default function MessageBox(props){
    return(
        <div className = {`aler alert-${props.variant || `info`}`}>
            {props.children}  
        </div>
    )
}