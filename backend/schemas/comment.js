export default {   
    name:'comment',
    title: 'Comment',
    type: 'document',
    fields: [
        {
            name: 'postedBy',
            title: 'PostedBy',
            type: 'postedBy', // automatically reference the postedBy 

        },
        {
            name: 'comment',
            title: 'Comment',
            type: 'string'
        },
    ]
}