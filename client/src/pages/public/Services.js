import React, { useEffect, useRef } from "react";
import { Breadcrumbs, Button, InputField } from "../../components";
import { useParams } from "react-router-dom";
import icons from "../../ultils/icons";

const Services = () => {
  const titleRef = useRef();

  const { contact } = useParams();

  const { MdEmail, FaPerson, TiTick, FaPhoneAlt } = icons;

  useEffect(() => {
    titleRef.current.scrollIntoView({ block: "start" });
  }, []);

  return (
    <div className="w-full">
      <div
        ref={titleRef}
        className="h-[81px] mt-4 flex justify-center items-center bg-gray-50"
      >
        <div className="w-main">
          <span className="font-semibold text-[18px] uppercase">
            {contact.slice(1)}
          </span>
          <div className="mt-2">
            <Breadcrumbs category={contact.slice(1)}></Breadcrumbs>
          </div>
        </div>
      </div>
      <div className="w-main mx-auto my-4 h-[450px]">
        <iframe
          className="h-full w-full"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d19662.641963827326!2d105.75694908082117!3d20.977624429344708!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3134532e27541a43%3A0x924b0a098112a1b4!2zUC4gTOG7pWEsIGzDoG5nIFbhuqFuIFBow7pjLCBW4bqhbiBQaMO6YywgSMOgIMSQw7RuZywgSMOgIE7hu5lpLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v1712928573598!5m2!1svi!2s"
          allowfullscreen=""
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
      <div className="w-main mx-auto my-10 ">
        <div className="flex w-full text-sm">
          <div className="flex-1 flex flex-col gap-2 justify-start">
            <p>
              Sed vestibulum faucibus felis, sit amet facilisis tellus. Aliquam
              erat volutpat. Sed consectetur ipsum velit, quis rhoncus libero
              egestas eget.
            </p>
            <span className="flex gap-2 justify-start items-center">
              <FaPerson color="red" size={20}></FaPerson>
              <p>Address: 474 Ontario St Toronto, ON M4X 1M7 Canada</p>
            </span>
            <span className="flex gap-2 justify-start items-center">
              <TiTick color="red" size={20}></TiTick>
              <p>Opening hours</p>
            </span>
            <span className="flex flex-col gap-2 ml-7">
              <p>Mon-Fri : 11.00 - 20.00</p>
              <p>Sat: 10.00 - 20.00</p>
              <p>Sun: 19.00 - 20.00</p>
            </span>
            <span className="flex gap-2 justify-start items-center">
              <MdEmail color="red" size={18}></MdEmail>
              <p>Email: support@tadathemes.com</p>
            </span>
            <span className="flex gap-2 justify-start items-center">
              <FaPhoneAlt color="red" size={15}></FaPhoneAlt>
              <p>Phone: (+123)345 678 xxx</p>
            </span>
          </div>
          <div className="flex-1 flex flex-col justify-start items-end h-full gap-1">
            <div className="flex gap-1 w-full">
              <input
                type="text"
                className="w-full h-10 p-4 bg-gray-100"
                placeholder="Name"
              />
              <input
                type="text"
                className="w-full h-10 p-4 bg-gray-100"
                placeholder="Email"
              />
            </div>
            <input
              type="text"
              className="w-full h-10 p-4 bg-gray-100"
              placeholder="Phone Number"
            />
            <textarea
              className="w-full h-[130px] bg-gray-100 p-4"
              placeholder="Message"
            ></textarea>
            <Button>Send</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
