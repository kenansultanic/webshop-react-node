
const DetailsThumb = ({images, tab, myRef}) => {

    return (
        <div className="thumb" ref={myRef}>
            {
                images.map((img, i) =>(
                    <img src={img.img_url} alt="" key={i}
                         onClick={() => tab(i)}
                    />
                ))
            }
        </div>
    )
}

export default DetailsThumb