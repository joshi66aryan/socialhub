import React, { useEffect, useState } from 'react';
import { MdDownloadForOffline } from 'react-icons/md';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid'; // to create unique id

import { client, urlFor } from '../client';
import MasonryLayout from './MasonryLayout';
import { pinDetailMorePinQuery, pinDetailQuery } from '../utils/sanitydatafetching';
import Spinner from './Spinner';

const PinDetail = ({user}) => {
  const [pins, setPins] = useState()
  const [pinDetails, setPinDetails] = useState()
  const [comment, setComment] = useState('')
  const [addingComment, setAddingComment] = useState(false)
  const { pinId } = useParams()


  const fetchPinDetail = () => {
    let query = pinDetailQuery(pinId) // get details of particular post 
    if(query) {
      client.fetch(query)
        .then((data) => {
          setPinDetails(data[0])

          if(data[0]){
            query = pinDetailMorePinQuery(data[0]) // get more similar post of same category

            client.fetch(query)
              .then((res) => setPins(res))
          }
        })
    }
  }

  const addComment = () => {

    if(comment) {
      setAddingComment(true)

      client
        .patch(pinId)
        .setIfMissing({ comments: []})
        .insert('after', 'comments[-1]', [{
          comment,
          _key: uuidv4(),
          postedBy: {
            _type: 'postedBy',
            _ref: user._id
          }
        }])
        .commit()
        .then(() => {
          fetchPinDetail()
          setComment('')
          setAddingComment(false)
        })
    }
  }

  useEffect(() => {
    fetchPinDetail()
  }, [pinId])

  if(!pinDetails) return <Spinner message =' Loading pin...'/>

  return (
    <>
      { pinDetails && (
        <div className='flex xl-flex-row flex-col m-auto bg-white lg:p-5 p-3 lg:w-4/5 w-full' style= {{maxwidth: '1500px', borderRadius: '32px'}}>

          {/* user name && image */}

          <Link to={`user-profile/${pinDetails?.postedBy?._id}`} className ='flex gap-2 mt-5 items-center'>
            <img 
              className='w-8 h-8 rounded-full object-cover'
              src = {pinDetails?.postedBy?.image}
              alt = "user-profile"
            />
            <p className='font-semibold capitalize'> {pinDetails?.postedBy?.userName}</p>
          </Link>

          <div>
            {/* picture title && details */}
            <h1 className='text-3xl font-bold break-words mt-5 '>
              {pinDetails.title}       
            </h1>
            <p className='mt-3 mb-8'>{pinDetails.about}</p>
          </div>

          <div className=' flex justify-center items-center'>
            {/* clicked image */}
            <img 
              src = { pinDetails?.image && urlFor(pinDetails?.image).width(400).url()}
              className ='rounded-t-3xl rounded-b-lg'
              alt=" user-post"
            />
          </div>

          <div className='w-full p-5 flex-1 xl:min-w-62'>

              {/* hyper link and download icons */}
              <div className='flex items-center justify-between'>
                <div className='flex gap-2 items-center'>

                  <a       
                    href={`${pinDetails?.image?.asset?.url}?dl=`}
                    download 
                    onClick = {(e) => e.stopPropagation()}      
                    className="bg-white w-9 h-9 p-2 rounded-full flex items-center justify-center text-dark
                              text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
                  >
                    <MdDownloadForOffline/> 
                  </a> 

                </div>

                <a 
                  href = {pinDetails.destination} 
                  target ='_blank'
                  rel ='noreferrer'
                >
                  {pinDetails.destination?.slice(8)}
                </a>

              </div>

              {/* displaying comments */}
              <h2 className='mt-5 text-2xl'> Comments </h2>
              <div className='max-h-370 overflow-y-auto'>
                
                { pinDetails?.comments?.map((item,i) => ( // mapping through the posted comments
                  <div className='flex gap-2 mt-5 items-center bg-white rounded-lg' key={i}>
                      <img
                        src ={item.postedBy.image} // user image, name
                        alt ='user-profile'
                        className='w-10 h-10 rounded-full cursor-pointer'
                      />
                      <div className='flex flex-col'> 
                        <p className='font-bold'>{item.postedBy?.userName}</p>
                        <p>{item.comment}</p>
                      </div>
                  </div>
                ))}

              </div>

                {/* input field for entering the comment and posting button */}
                <div className='flex flex-wrap mt-6 gap-3'>
                  <Link to={`user-profile/${user?._id}`} >
                    <img 
                      className='w-10 h-10 rounded-full cursor-pointer'
                      src = {user?.image}
                      alt = "user-profile"
                    />
                  </Link>  
                  <input
                    className='flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300'
                    type ='text'
                    placeholder='Add a comment'
                    value = {comment}
                    onChange ={(e) => setComment(e.target.value)}
                  />
                  <button
                  type ='button'
                  className='bg-red-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none'
                  onClick ={ addComment }
                  >
                    { addingComment? 'Doing':'Done'}
                  </button>
                </div>
            </div>
        </div>
      )}
      { // recommending the similar posts
        pins?.length >0 ? (
            <>
              <h2 className='text-center font-bold text-2x mt-8 mb-4'>
                More like this
              </h2>
              <MasonryLayout pins ={pins} />
            </>
          ): 
          ( <Spinner  message = 'Loading more pins ...'/>)
      }
    </>
  )
}

export default PinDetail