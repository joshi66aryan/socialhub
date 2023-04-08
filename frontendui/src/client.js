import sanityClient from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

// for client side to connect with sanity backend
export const client = sanityClient({
    projectId : process.env.REACT_APP_PROJECT_ID, // store in .env variable
    dataset: 'production',
    useCdn: true,
    token: process.env.REACT_APP_SANITY_TOKEN
})

const builder = imageUrlBuilder(client); //only used for image

export const urlFor = (source) => builder.image(source); //only used for image