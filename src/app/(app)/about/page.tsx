
import { Rocket } from 'lucide-react'
import Link from 'next/link'

function Page() {
  return (
    <div className=' px-2  xl:px-56  lg:px-32 mt-16 mb-5'>
      <div className=" flex flex-col border rounded-sm p-3 ">
        <h1 className=' text-4xl font-bold text-center '>
          Welcome to Fair Feedback
        </h1>
        <p className=' pt-5 text-center'>
          At Fair Feedback, we are dedicated to creating a transparent and equitable feedback environment where every voice is heard and valued. Our platform is designed to facilitate honest, constructive, and respectful feedback exchanges, empowering individuals and organizations to grow, learn, and thrive together.
        </p>
      </div>
      <div className="flex flex-col border rounded-sm p-3 mt-5 ">
        <h1 className=' text-2xl font-bold text-center'>
          <Rocket className=' inline-block mr-3 ' />Our Mission
        </h1>
        <p className=' pt-5 text-center'>
          Our mission at Fair Feedback is to promote fairness, openness, and integrity in the feedback process. We believe that everyone deserves a fair chance to express their opinions and perspectives in a supportive and inclusive space.
        </p>
      </div>
      <div className="  flex flex-col md:flex-row justify-between gap-5 mt-5">
        <div className="flex flex-col border rounded-sm p-3  md:w-1/2 ">
          <h3 className=' text-2xl font-bold text-center'>How It Works</h3>
          <div className="pt-5 text-left gap-3">
            <p>Fair Feedback offers a user-friendly platform that simplifies the feedback process. Here&lsquo;s how it works:</p>
            <ol className=' mt-3 flex flex-col gap-3 '>
              <li > <span className=' font-semibold text-lg'>Submit Feedback:</span> Users can submit feedback anonymously or openly, depending on their preference. Our platform ensures confidentiality and anonymity, encouraging honesty and transparency.</li>
              <li>
                <span className='font-semibold text-lg'>Receive Feedback: </span>
                Receive feedback from peers, colleagues, customers, or stakeholders in a constructive and respectful manner. Our platform promotes a culture of mutual respect and understanding.
              </li>
              <li>
                <span className='font-semibold text-lg'>Engage in Dialogue: </span>
                Engage in meaningful dialogue and discussion around the feedback received. Clarify any points, ask questions, and collaborate on solutions for improvement.
              </li>
            </ol>
          </div>
        </div>
        <div className="flex flex-col border rounded-sm p-3  md:w-1/2">
          <h3 className=' text-2xl font-bold text-center' >Why Choose Fair Feedback</h3>
          <ul className=' mt-3 flex flex-col gap-3 '>
            <li>
              <span className='font-semibold text-lg'>
                Fair and Transparent:
              </span> 
              Our platform ensures fairness and transparency in the feedback process, promoting trust and integrity among users.
            </li>
            <li>
              <span className='font-semibold text-lg'>
                Anonymous Option:
              </span>
              We offer the option for anonymous feedback submission to encourage honesty and openness without fear of repercussions.
            </li>
            <li>
              <span className='font-semibold text-lg'>
                Safe Environment:
              </span>
              Fair Feedback provides a safe and supportive environment for individuals to share their opinions and perspectives without judgment or bias.
            </li>
            <li>
              <span className='font-semibold text-lg'>
                Continuous Improvement:
              </span>
              By embracing feedback as a catalyst for growth and learning, Fair Feedback empowers individuals and organizations to continuously improve and evolve.
            </li>
          </ul>
        </div>
      </div>
   
        <div className="mt-5 flex flex-col  border rounded-sm p-3">
          <h3 className='text-2xl font-bold text-center'>
            Get Started Today
          </h3>
          <p className='pt-5 text-center'>
            Join the Fair Feedback community and experience the power of fair and transparent feedback exchanges. Sign up for a free account and start sharing and receiving feedback in a supportive and inclusive environment.
          </p>
        </div>

        <div className="mt-5 flex flex-col border rounded-sm p-3">
            <h3 className='text-2xl font-bold text-center'>
              Have Feedback for Us?
              </h3>
          <p className='pt-5 text-center'>
            We&lsquo;re committed to continuous improvement and welcome your suggestions, comments, and questions. Please <Link className=' text-blue-500' href='/contact'>
              click here </Link>
             to visit our contact page and let us know how we can better serve you.

            Together, let&lsquo;s create a culture of fairness, openness, and growth through feedback. Welcome to Fair Feedback!
          </p>     
      </div>
    </div>
  )
}

export default Page