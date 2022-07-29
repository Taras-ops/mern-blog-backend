import PostModel from '../models/Post.js'

export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec()
    const tags = posts
      .map((post) => post.tags)
      .flat()
      .slice(0, 5)

    res.json(tags)
  } catch (err) {
    res.status(500).json({ message: err })
  }
}

export const getAll = async (req, res) => {
  try {
    let posts
    if (req.query.popular == 'true') {
      posts = await PostModel.find()
        .populate('comments')
        .populate('user')
        .sort({ viewsCount: -1, createdAt: -1 })
        .exec()
    } else {
      posts = await PostModel.find()
        .populate('comments')
        .populate('comments.user')
        .populate('user')
        .sort({ createdAt: -1 })
        .exec()
    }

    if (!posts) {
      return res.status(400).json({ message: 'Posts are not found' })
    }

    res.json(posts)
  } catch (err) {
    res.status(500).json({ message: err })
  }
}

export const getOne = async (req, res) => {
  try {
    PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $inc: { viewsCount: 1 },
      },
      {
        returnDocument: 'after',
      },
      (err, doc) => {
        if (err) {
          return res.status(500).json({
            message: "Article isn't return",
          })
        }

        if (!doc) {
          return res.status(404).json({
            message: "Post doesn't found",
          })
        }

        res.json(doc)
      }
    ).populate('user')
  } catch (err) {
    res.status(500).json({ message: err })
  }
}

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      tags: req.body.tags,
      imageUrl: req.body.imageUrl,
      user: req.userId,
    })

    const post = await doc.save()

    res.json(post)
  } catch (err) {
    res.status(500).json({ message: err })
  }
}

export const remove = async (req, res) => {
  try {
    PostModel.findOneAndDelete(
      {
        _id: req.params.id,
      },
      (err, doc) => {
        if (err) {
          return res.status(500).json({ message: 'Not delete post' })
        }

        if (!doc) {
          return res.status(400).json({ message: 'Post does not found' })
        }

        res.json({
          success: true,
        })
      }
    )
  } catch (err) {
    res.status(500).json({ message: err })
    console.log(err)
  }
}

export const update = async (req, res) => {
  try {
    const postId = req.params.id

    const updatedPost = await PostModel.findByIdAndUpdate(postId, {
      title: req.body.title,
      text: req.body.text,
      tags: req.body.tags,
      imageUrl: req.body.imageUrl,
      user: req.userId,
    })

    res.json(updatedPost)
  } catch (err) {
    res.status(500).json({ message: err })
  }
}

export const getByTag = async (req, res) => {
  try {
    const tag = req.params.tag

    const posts = await PostModel.find({
      tags: { $in: [tag] },
    })

    res.json(posts)
  } catch (err) {
    res.status(500).json({ message: err })
  }
}

export const relatedPosts = async (req, res) => {
  try {
    const postId = req.params.id
    const posts = await PostModel.find({ _id: { $ne: postId } })
      .sort({ viewsCount: -1, createdAt: -1 })
      .limit(5)
      .exec()

    res.json(posts)
  } catch (err) {
    res.status(500).json({ message: err })
  }
}

export const likeToggle = async (req, res) => {
  try {
    const { id } = req.params

    const post = await PostModel.findById(id)
    if(!post.likes.includes(req.userId)) {
      await post.updateOne({ $push: {likes: req.userId} })
      res.json("The post has been liked")
    } else {
      await post.updateOne({ $pull: {likes: req.userId} })
      res.json("The post has been disliked")
    }

  } catch (err) {
    res.status(500).json({ message: err })
  }
}
