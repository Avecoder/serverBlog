import Post from '../models/Post.js'


export const getLastTags = async (req, res) => {
  try {

    const posts = await Post.find().limit(5).exec()

    const tags = posts.map(item => item.tags).flat().slice(0, 5)

    return res.status(200).json(tags)

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить теги'
    })
  }
}

export const createPost = async (req, res) => {
  try {
    const doc = new Post({
      title: req.body.title,
      text: req.body.text,
      tags: req.body.tags,
      imageURL: req.body.imageURL,
      user: req.userId
    })

    const post = await doc.save()

    return res.status(200).json(post)
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Не удалось создать статью'
    })
  }
}


export const getAll = async (req, res) => {
  try {

    const posts = await Post.find().populate('user').exec()

    return res.status(200).json(posts)

  } catch (e) {
    console.log(err)
    res.status(404).json({
      message: 'Не удалось найти статьи'
    })
  }
}


export const getOne = async (req, res) => {
  try {
    const postId = req.params.id

    Post.findOneAndUpdate(
      {
        _id: postId
      },
      {
        $inc: {viewsCount: 1}
      },
      {
        returnDocument: 'after'
      },
      (err, doc) => {
        if(err) {
          console.log(err)
          res.status(500).json({
            message: 'Не удалось вернуть статью'
          })
        }

        if (!doc) {
          return res.status(404).json({
            message: 'Статья не найдена'
          })
        }

        res.json(doc)
      }
    )


  } catch (e) {
    console.log(err)
    res.status(500).json({
      message: 'Не удалось получить статью'
    })
  }
}


export const removePost = async (req, res) => {
  const postId = req.params.id

  Post.findOneAndDelete(
    {
      _id: postId
    },
    (err, doc) => {
      // Если ошибка
      if (err) {
        console.log(err)
        res.status(500).json({
          message: 'Не удалось удалить статью'
        })
      }

      // Если ошибка статья не нашлась
      if(!doc) {
        return res.status(404).json({
          message: 'Статья не найдена'
        })
      }


      res.json({
        id: postId
      })
    }
  )
}

export const updatePost = async (req, res) => {
  try {
    const postId = req.params.id

    await Post.updateOne(
      {
        _id: postId
      },
      {
        title: req.body.title,
        text: req.body.text,
        tags: req.body.tags,
        imageURL: req.body.imageURL,
        user: req.userId
      }
    )

    res.json({
      success: true
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Не удалось обновить статью'
    })
  }
}
