import ContactForm from "@/components/assets/ContactForm"
import { Separator } from "@/components/ui/separator"
import { Mail, Phone } from "lucide-react"
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Fair Feedback - Get in Touch",
  description: "Need help or have questions? Contact the Fair Feedback team for support.",
  keywords: ["contact fair feedback", "support", "feedback contact"],
  authors: [{ name: "Dhaval Dharaviya" }],
  robots: "index, follow",
  alternates: {
    canonical: "https://fair-feedback.vercel.app/contact",
  }
};

const ContactPage = () => {
  return (
    <div className=' px-2  xl:px-56  lg:px-32 mt-16 mb-5 '>
      <div className="text-center ">
        <h1 className=' text-4xl  font-bold'>Contact Us</h1>
        <p className='mt-5'>Your input matters to Fair Feedback! We&#39;re eager to hear from you and improve our platform. </p>
      </div>
      <div className=" flex flex-row justify-center max-sm:items-center  gap-8 mt-5 border rounded-lg p-5 max-sm:flex-col max-w-screen-lg ">
        <div className=" w-1/2 max-sm:w-full  flex justify-center flex-col gap-8 max-sm:max-w-sm ">
          <p className="">Thank you for your interest in reaching out to us. Please use the following contact information or the form to get in touch with our team.</p>
         <div className="flex justify-center flex-col gap-4">
         <div className="flex flex-row items-center gap-3">
            <Phone/>
              <a href="tel:9408895506">+91 9408895506</a>
          </div>
          <div className="flex flex-row items-center gap-3">
            <Mail/>
              <a href="mailto:dadharaviya732002@gmail.com">dadharaviya732002@gmail.com</a>
          </div>
         </div>
        </div>
        <Separator className=" sm:hidden" />
        <div className=" max-w-sm w-1/2 max-sm:w-full">
          <ContactForm/>
        </div>
      </div>
    </div>
  )
}

export default ContactPage