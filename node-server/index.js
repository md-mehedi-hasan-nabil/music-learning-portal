const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;


const app = express()
const port = process.env.PORT || 5000
require('dotenv').config()

const stripe = require("stripe")(process.env.PAYMENT_SECRET_KEY);

// apply middleware
app.use(express.json());
app.use(morgan('tiny'))
// Enable All CORS Requests
app.use(cors())

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.kdlsc.mongodb.net/?retryWrites=true&w=majority`;

const database = "LyricLounge"
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const verifyToken = (req, res, next) => {
    const authorization = req.headers.authorization;
    if (!authorization) {
        return res.status(401).send({ error: true, message: 'unauthorized access' });
    }
    // bearer token
    const token = authorization.split(' ')[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send({ error: true, message: 'unauthorized access' })
        }
        req.decoded = decoded;
        next();
    })
}

async function run() {
    try {
        // Connect the client to the server
         client.connect();

        // database collections
        const userCollection = client.db(database).collection('user');
        const courseCollection = client.db(database).collection('course');
        const selectedCourseCollection = client.db(database).collection('selected_course');
        const enrolledCourseCollection = client.db(database).collection('enrolled_course');
        const paymentCollection = client.db(database).collection('payment');
        const feedbackCollection = client.db(database).collection('feedback');

        //payment
        app.post("/api/create-payment-intent", verifyToken, async (req, res) => {
            try {
                const { price } = req.body;
                const amount = parseInt(price * 100);
                const paymentIntent = await stripe.paymentIntents.create({
                    amount: amount,
                    currency: 'usd',
                    payment_method_types: ['card']
                });

                res.send({
                    clientSecret: paymentIntent.client_secret
                })
            } catch (error) {
                console.log(error)
                res.status(500).send(error)
            }
        });

        app.get("/api/payment", verifyToken, async (req, res) => {
            try {
                const payments = await paymentCollection.find().sort({ date: -1 })
                const result = await payments.toArray()
                res.send(result)
            } catch (error) {
                console.log(error)
                res.status(500).send(error)
            }
        })

        app.get("/api/payment/:email", verifyToken, async (req, res) => {
            try {
                const email = req.params.email
                const payment = await paymentCollection.findOne({ email })
                res.send(payment)
            } catch (error) {
                res.status(500).send(error)
            }
        })

        app.post("/api/payment", verifyToken, async (req, res) => {
            try {
                const { email, transactionId, price, date, course_id, selectedCourseId } = req.body

                const payment = await paymentCollection.insertOne({ email, transactionId, price, date, course_id })
                const selectedCourse = await selectedCourseCollection.findOne({ _id: new ObjectId(selectedCourseId) })
                const { user, course } = selectedCourse
                await enrolledCourseCollection.insertOne({ user, course })
                const removeselectedCourse = await selectedCourseCollection.deleteOne({ _id: new ObjectId(selectedCourseId) })

                res.status(201).send({ payment, selectedCourse: removeselectedCourse })
            } catch (error) {
                console.log(error)
                res.status(500).send(error)
            }
        })

        // user api
        app.get('/api/user', async (req, res) => {
            try {
                const users = await userCollection.find()
                const result = await users.toArray()
                res.send(result)
            } catch (error) {
                res.status(500).send(error)
            }
        })

        app.get('/api/user/:email', async (req, res) => {
            try {
                const email = req.params.email
                const user = await userCollection.findOne({ email })
                res.send(user)
            } catch (error) {
                res.status(500).send(error)
            }
        })

        app.post('/api/user', async (req, res) => {
            try {
                const { email } = req.body
                const user = await userCollection.findOne({ email })
                const token = jwt.sign(req.body, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '12h' })

                if (!user) {
                    const result = await userCollection.insertOne(req.body)
                    res.status(201).send({ result, accessToken: token })
                } else {
                    res.status(200).send({ message: "User already exist.", accessToken: token })
                }
            } catch (error) {
                // console.log(error)
                res.status(500).send(error)
            }
        })

        app.patch('/api/user-role/:userId', verifyToken, async (req, res) => {
            try {
                const id = req.params.userId
                const { role } = req.body

                if (role) {
                    const result = await userCollection.updateOne({ _id: new ObjectId(id) }, {
                        $set: {
                            role
                        }
                    })
                    res.send(result)
                } else {
                    res.status(500).send({ error: "Field required" })
                }

            } catch (error) {
                console.log(error)
                res.status(500).send(error)
            }
        })

        // music course api
        app.get('/api/course', async (req, res) => {
            try {
                const courses = await courseCollection.find()
                const result = await courses.toArray()
                res.send(result)
            } catch (error) {
                res.status(500).send(error)
            }
        })

        app.get('/api/course/:courseId', async (req, res) => {
            try {
                const id = req.params.courseId
                const course = await courseCollection.findOne({ _id: new ObjectId(id) })
                res.send(course)
            } catch (error) {
                res.status(500).send(error)
            }
        })

        app.post('/api/course', verifyToken, async (req, res) => {
            try {
                const { title, seats, image, name, email, price, status, total_seats, date } = req.body || {}
                const result = await courseCollection.insertOne({
                    title, seats: Number(seats), image, name, email, price: Number(price), status, total_seats: Number(total_seats)
                })
                res.status(201).json(result)
            } catch (error) {
                res.status(500).send(error)
            }
        })

        app.patch('/api/course/:courseId', verifyToken, async (req, res) => {
            try {
                const id = req.params.courseId
                const data = req.body;

                const result = await courseCollection.updateOne({ _id: new ObjectId(id) }, {
                    $set: data
                })
                res.status(201).send(result)
            } catch (error) {
                res.status(500).send(error)
            }
        })

        app.patch('/api/course-status/:courseId', verifyToken, async (req, res) => {
            try {
                const id = req.params.courseId
                const { status } = req.body;
                console.log(req.body)
                if (status) {
                    const result = await courseCollection.updateOne({ _id: new ObjectId(id) }, {
                        $set: {
                            status
                        }
                    })
                    res.status(201).send(result)
                } else {
                    res.status(500).send({ error: "Field required" })
                }

            } catch (error) {
                res.status(500).send(error)
            }
        })

        // selected course api
        app.get("/api/selected-course", async (req, res) => {
            try {
                const selectedCourses = await selectedCourseCollection.find()
                const result = await selectedCourses.toArray()
                res.status(200).send(result)
            } catch (error) {
                res.status(500).send(error)
            }
        })

        app.get("/api/selected-course/:selectedCourseId", async (req, res) => {
            try {
                const id = req.params.selectedCourseId
                const selectedCourse = await selectedCourseCollection.findOne({ _id: new ObjectId(id) })
                const course = await courseCollection.findOne({ _id: new ObjectId(selectedCourse.course) })
                res.status(200).send({ ...selectedCourse, course })
            } catch (error) {
                res.status(500).send(error)
            }
        })

        app.post('/api/selected-course', verifyToken, async (req, res) => {
            try {
                const { user, course } = req.body || {} // user === email and course === course_id

                const courseData = await courseCollection.findOne({ _id: new ObjectId(course) })
                await courseCollection.updateOne({ _id: new ObjectId(course) }, {
                    $set: {
                        seats: courseData.seats - 1
                    }
                })

                const newSelectedCourse = await selectedCourseCollection.insertOne({
                    user, course
                })
                res.status(201).json(newSelectedCourse)

            } catch (error) {
                console.log(error)
                res.status(500).send(error)
            }
        })

        app.patch('/api/selected-course/:id', verifyToken, async (req, res) => {
            try {
                const id = req.params.id
                const { courseId } = req.body

                const course = await courseCollection.findOne({ _id: new ObjectId(courseId) })
                await courseCollection.updateOne({ _id: new ObjectId(courseId) }, {
                    $set: {
                        seats: course.seats + 1
                    }
                })

                const result = await selectedCourseCollection.deleteOne({ _id: new ObjectId(id) })

                res.status(200).json(result)
            } catch (error) {
                res.status(500).send(error)
            }
        })

        // enrolled course api
        app.get("/api/enrolled-course", verifyToken, async (req, res) => {
            try {
                const enrolledCourse = await enrolledCourseCollection.find()
                const result = await enrolledCourse.toArray()
                res.status(200).send(result)
            } catch (error) {
                res.status(500).send(error)
            }
        })

        app.post('/api/enrolled-course', verifyToken, async (req, res) => {
            try {
                const { user, course } = req.body || {} // user === email and course === course_id
                const newEnrolledCourse = await enrolledCourseCollection.insertOne({
                    user, course
                })
                res.status(201).json(newEnrolledCourse)
            } catch (error) {
                res.status(500).send(error)
            }
        })

        // payment api
        app.get('/api/payment', verifyToken, async (req, res) => {
            try {
                const payment = await paymentCollection.find()
                const result = payment.toArray()
                res.status(200).send(result)
            } catch (error) {
                res.status(500).send(error)
            }
        })

        app.post('/api/payment', verifyToken, async (req, res) => {
            try {
                const { user, course } = req.body || {} // user === user_id and course === course_id
                const newPayment = await paymentCollection.insertOne({
                    user, course
                })
                res.status(201).json(newPayment)
            } catch (error) {
                res.status(500).send(error)
            }
        })

        // feedback api
        app.get('/api/feedback', verifyToken, async (req, res) => {
            try {
                const feedbacks = await feedbackCollection.find()
                const result = await feedbacks.toArray()
                res.status(200).send(result)
            } catch (error) {
                res.status(500).send(error)
            }
        })

        app.get('/api/feedback/:courseId', verifyToken, async (req, res) => {
            try {
                const courseId = req.params.courseId
                const feedback = await feedbackCollection.findOne({ courseId })
                if (feedback) {
                    res.status(200).send(feedback)
                } else {
                    res.status(200).send({})
                }

            } catch (error) {
                res.status(500).send(error)
            }
        })

        app.post('/api/feedback', verifyToken, async (req, res) => {
            try {
                const { message, email, courseId } = req.body || {}
                if (message && email && courseId) {
                    const newFeedback = await feedbackCollection.insertOne({
                        message, email, courseId
                    })
                    res.status(201).json(newFeedback)
                }
                else {
                    res.status(500).send({ error: "Field required" })
                }
            } catch (error) {
                res.status(500).send(error)
            }
        })


        console.log("You successfully connected to MongoDB!");

    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})

