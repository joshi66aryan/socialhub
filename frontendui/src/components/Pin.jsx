//imported in masonary layout
import React, { useState } from 'react'
import { client, urlFor } from '../client'
import {Link, useNavigate} from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { MdDownloadForOffline} from 'react-icons/md'
import {AiTwotoneDelete} from 'react-icons/ai'
import {BsFillArrowUpRightCircleFill} from'react-icons/bs'
import { fetchUserLS } from '../utils/fetchUserLS'

const Pin = ({pinItem}) => {


  const { postedBy, image, _id, destination } = pinItem;  //destructuring
  const [postHovered, setPostHovered] = useState(false)

  const navigate = useNavigate()
  const userInfo = fetchUserLS() // fetch the locastorage users, file in 

  const alreadySaved = !!(pinItem?.save?.filter(item => item.postedBy._id === userInfo?.sub))?.length;
  // 1, [2,3,1] -> [1].length -> 1 -> !1 -> false -> !false -> true
  // 4, [2,3,1] -> [].length -> 0 -> !0 -> true -> !true -> false

  const savePin = (id) => {
    if(!alreadySaved) {

      client
       .patch(id)
       .setIfMissing({save : []})
       .insert('after', 'save[-1]', [{
        _key: uuidv4(), // create new id for each instance
        userId: userInfo?.sub,
        postedBy: {
          _type: 'postedBy',
          _ref: userInfo?.sub
        }
       }])
       .commit()
       .then(() => {
        window.location.reload();
       })
    }
  }

  const deletePin = (id) => {
    client
      .delete(id)
      .then(() => {
        window.location.reload()
      })
  }
  return (
      <div className='m-2'>

        <div
          onMouseEnter={() => setPostHovered(true)}
          onMouseLeave={() => setPostHovered(false)}
          onClick = {() => navigate(`/pin-detail/${_id}`)}  
          className ='relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out '
        >
          { 
            image && (
              <img 
                className='rounded-lg w-full' 
                alt="user-post" 
                src = {urlFor(image.asset.url).width(250).url()}
              />
            )  
          }

          { 
            postHovered && (              // while hovering over image
                <div
                  className="absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50"
                  style={{ height: '100%' }}
                >

                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">

                      <a                   // let download the image
                        href={`${image?.asset?.url}?dl=`}
                        download 
                        onClick = {(e) => e.stopPropagation()}       // stop the triggering of the other event while clicking other one
                        className="bg-white w-9 h-9 p-2 rounded-full flex items-center justify-center text-dark
                                  text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
                      >
                        <MdDownloadForOffline/> 
                      </a> 
                    </div>

                    {  //save or saved button 
                      alreadySaved?(
                        <button 
                          type="button" 
                          className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none"
                        >
                          {pinItem?.save?.length} Saved
                        </button>
                      ):(
                        <button 
                          onClick = {(e) => {
                            e.stopPropagation()
                            savePin(_id)
                          }}
                          type="button"
                          className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none"
                        >
                          save
                        </button>
                      )
                    }
                  </div> 
                  <div className='flex justify-between items-center gap-2 w-full'>
                    { // link of image source at bottom of image
                      destination && (
                        <a
                          href = {destination}
                          onClick = {(e) => {
                            e.stopPropagation()
                          }}
                          target="_blank"
                          rel="noreferrer"
                          className='bg-white flex items-center gap-2 text-black font-bold p-2 pl-4 pr-4 rounded-full opacity-70 hover:100 hover:shadow-md '
                        >
                          {''}
                          <BsFillArrowUpRightCircleFill/>
                          {destination.length > 20 ? destination.slice(8,20) : destination.slice(8)}
                        </a>
                      )
                    }
                    { // delete button
                      postedBy?._id === userInfo.sub && (
                        <button 
                          onClick = {(e) => {
                            e.stopPropagation()
                            deletePin(_id)
                          }}
                          type="button"
                          className="bg-white p-2 opacity-70 hover:opacity-100 text-dark font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none"
                        >
                          <AiTwotoneDelete/>
                        </button>
                      )
                    }
                  </div>     
              </div>
            )  
          }
        </div>
        
        <Link to={`user-profile/${postedBy?._id}`} className ='flex gap-2 mt-2 items-center'>
          <img 
            className='w-8 h-8 rounded-full object-cover'
            src = {postedBy?.image}
            alt = "user-profile"
          />
          <p className='font-semibold capitalize'> {postedBy?.userName}</p>
        </Link>

      </div>
  )
}

export default Pin