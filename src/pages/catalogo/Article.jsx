import React, { useEffect, useState } from 'react';
import {Link} from 'react-router-dom';

const Article = ({item, index}) => {
    const [isHovered, setIsHovered] = useState(false);
    const [indexImageHovered, setIndexImageHovered] = useState(0);
    const [animationEnded,setAnimationEnded] = useState(false);

    return (
            <Link to={`/producto/${item._id}`} 
            onAnimationEnd={() => setAnimationEnded(true)}
            style={ animationEnded? {opacity: "100%"} : {animation: `catalogo-article-show 0.3s ease ${0.1 * (index + 1)}s forwards`} }
            className={"catalogo-article"}
        
            // onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {setIsHovered(false); setIndexImageHovered(0)}}
            onMouseOver={() => setIsHovered(true)}
            onMouseOut={() => setIsHovered(false)}
            >
                {item.off && item.off > 0 ?
                    <div className='article-off-star'>
                        <h4 style={{margin: "-0.6rem 0 0 0.55rem"}}>
                            -{item.off}%
                        </h4>
                    </div>
                    :
                    null
                }
                <h2>{item.name}</h2>
                <span style={{display: isHovered && item.images.length > 1 ? "flex" : "none"}} className='catalog-img-span'>
                    {item.images.map((src, imageIndex) => {
                            // Solo muestra 4 imagenes sin contar la primera.
                            if (imageIndex === 0 || imageIndex >= 5) return null

                            return indexImageHovered !== imageIndex ? 
                                <img key={imageIndex} src={src} alt="" className='catalogo-img' 
                                onMouseEnter={() => setIndexImageHovered(imageIndex)}/>
                                :
                                <img key={imageIndex} src={src} alt="" className='catalogo-img' style={{opacity: "20%"}}/>
                        })
                    }
                </span>
                <img src={item.images[indexImageHovered]} alt="imagen del producto" className="catalogo-img-focus"/>
            </Link>
        )
}

export default Article;