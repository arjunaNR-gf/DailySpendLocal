import './Notification.css'
const LoaderNotificaiton = ({ type,text }) => {

    if (type === 'H') {
        return (
            <>
                <div className='loade-bck'>
                     { text && <div className='Notification-message'>{text}</div>}
                    <span class="loader-sqare"></span>
                </div>
            </>
        )
    }
    else if (type === 'C') {
        return (
            <>
                <div className='loade-bck'>
                     { text && <div className='Notification-message'>{text}</div>}
                    <div class="loader-circle"></div>
                </div>
            </>
        )
    }
    else if (type === 'SC') {
        return (
            <>
                <div className='loade-bck'>
                     { text && <div className='Notification-message'>{text}</div>}
                    <div class="loader-squarecircle"></div>
                </div>
            </>
        )
    }
    else if(type === 'CS')
    {
        return (
            <>
                <div className='loade-bck'>
                     { text && <div className='Notification-message'>{text}</div>}
                    <div class="loader-CS"></div>
                </div>
            </>
        )
    }
    else if(type === 'LN')
    {
        return (
            <>
                <div className='loade-bck'>
                     { text && <div className='Notification-message'>{text}</div>}
                    <div class="loader-LN"></div>
                </div>
            </>
        )
    }
    else if(type === 'SLN')
    {
        return (
            <>
                <div className='loade-bck'>
                     { text && <div className='Notification-message'>{text}</div>}
                    <div class="loader-SLN"></div>
                </div>
            </>
        )
    }
     else if(type === 'SS')
    {
        return (
            <>
                <div className='loade-bck-yellow'>
                   { text && <div className='Notification-message'>{text}</div>}
                    <div class="loader-SS"></div>
                </div>
            </>
        )
    }

     else if(type === 'PP')
    {
        return (
            <>
                <div className='loade-bck-yellow'>
                   { text && <div className='Notification-message'>{text}</div>}
                    <div class="loader-PP"></div>
                </div>
            </>
        )
    }

        else if(type === 'DD')
    {
        return (
            <>
                <div className='loade-bck-yellow'>
                   { text && <div className='Notification-message'>{text}</div>}
                    <div class="loader-DD"></div>
                </div>
            </>
        )
    }

    
        else if(type === 'BB')
    {
        return (
            <>
                <div className='loade-bck-yellow'>
                   { text && <div className='Notification-message'>{text}</div>}
                    <div class="loader--BB"></div>
                </div>
            </>
        )
    }
}
export default LoaderNotificaiton;