import Comment from "../models/Comment.js"
import Post from "../models/Post.js"

export const getAll = async (req, res) => {
     try {
        const postId = req.params.id

        const comments = await Comment.find({ postId: postId }).populate('user').sort({ createdAt: -1 })

        res.json(comments)
    } catch(err) {
        res.status(500).json({ message: err })
    }
}

export const create = async (req, res) => {
    try {
        const postId = req.params.id

        const doc = new Comment({
            text: req.body.text,
            user: req.userId,
            postId: postId
        })

        const comment = doc.save((err, result) => {
            if(err) {
                alert('Виникла помилка при створенні відгука')
                return res.json({ message: err })
            } else {
                Post.findById(postId, (err, post) => {
                    if(err) {
                        alert('Виникла помилка при створенні відгука')
                        return res.json({ message: err })
                    } 
                    
                    
                    if(!post) {
                        return res.json({ message: "Post in't found" })
                    }
                    
                    else {
                        post.comments.push(result)
                        post.save()
                        res.json(result)
                    }
                })
            }
        })

    } catch(err) {
        res.status(500).json({ message: err })
    }
}

export const remove = async (req, res) => {
    try {
        const {commentId} = req.params

        console.log(commentId)

        Comment.findByIdAndDelete(commentId, (err, doc) => {
            if(err) {
                return res.json({ message: err })
            }

            res.json({
                success: true
            })
        })

    } catch(err) {
        res.status(500).json({ message: err })
    }
}

export const update = async (req, res) => {
    try {
        const {commentId} = req.params


        const updatedComment = await commentId.findByIdAnd(commentId, {
            text: req.body.text,
            user: req.userId
        })


        res.json(updatedComment)
    } catch(err) {
        res.status(500).json({ message: err })
    }
}