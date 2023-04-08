import React, {useState, useEffect} from 'react'
import { useParams } from 'react-router-dom'//allows you to access the parameters of the current URL

import { client } from '../client'
import { searchQuery, feedQuery } from '../utils/sanitydatafetching';
import MasonryLayout from './MasonryLayout'
import Spinner from './Spinner';

const Feed = () => {
  const [loading, setLoading] = useState(false)
  const [pins, setPins] = useState(null)
  const { categoryId } = useParams()

  useEffect(() => {  // operate in componentDidMount, also when category chenges
    setLoading(true)
    if(categoryId) {
      const query = searchQuery(categoryId) // categoryId is name rather than string

      client.fetch(query) // fetching pins or posts
      .then((data) => {
        setPins(data)
        setLoading(false)
      })
    } else {
        client.fetch(feedQuery) //fetching feed query
        .then((data) => {
          setPins(data)
          setLoading(false)
        })
    }
  }, [categoryId])
  
  if(!pins?.length) return <h2> No pins available </h2>
  return (
    <div>
      {
        loading ? <Spinner message = {"We are adding new ideas to your feed! "}/>
        : <>
            {  pins && <MasonryLayout pins={pins}/> }
          </>
      }
    </div>
  )
}

export default Feed