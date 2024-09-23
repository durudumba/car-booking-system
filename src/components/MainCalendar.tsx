import Calendar from "react-calendar";
import {useState} from "react";
import {BookingModal} from "./BookingModal.tsx";

function MainCalendar() {
    const [bookingModalOpen, setBookingModalOpen] = useState(false);


    return (
        <>
            <Calendar
                showNeighboringMonth={false}
                calendarType={"hebrew"}
                minDetail={"decade"}
                onClickDay={() => {
                    setBookingModalOpen(true)
                }}
            />
            <BookingModal isModalOpen={bookingModalOpen} setIsModalOpen={setBookingModalOpen}/>
        </>

    )
}

export default MainCalendar