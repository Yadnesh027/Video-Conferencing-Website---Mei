'use client'

import React, { useState } from 'react'
import HomeCard from '@/components/HomeCard'
import { useRouter } from 'next/navigation'
import MeetingModal from '@/components/MeetingModal'
import { useUser } from '@clerk/nextjs'
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk'
import { useToast } from "@/components/ui/use-toast"
import { Textarea } from './ui/textarea'
import ReactDatePicker from 'react-datepicker';
import { Input } from './ui/input'


const MeetingTypeList = () => {
    const router = useRouter();
    const [meetingState, setMeetingState] = useState<'isScheduleMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | undefined>()

    const { toast } = useToast()

    const [values, setvalues] = useState({
        dateTime: new Date(),
        description: "",
        link: ""
    });

    const [callDetails, setCallDetails] = useState<Call>()


    const { user } = useUser();
    const client = useStreamVideoClient();

    const createMeeting = async () => {
        if (!client || !user) return;

        try {

            if (!values.dateTime) {
                toast({ title: "Please select a date and time", })
                return;
            }

            const id = crypto.randomUUID();
            const call = client.call('default', id);

            if (!call) throw new Error("Failed to create call");

            const startsAt = values.dateTime.toISOString() || new Date(Date.now()).toISOString();
            const description = values.description || "Instant meeting";

            await call.getOrCreate({
                data: {
                    starts_at: startsAt,
                    custom: {
                        description
                    }
                }
            })

            setCallDetails(call);

            if (!values.description) {
                router.push(`/meeting/${call.id}`)
            }

            toast({ title: "Meeting Created", })
        } catch (error) {
            console.log(error);
            toast({ title: "Failed to create meeting", })
        }
    }

    const meetingLink = '${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDeatils?.id}'

    return (
        <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4 pb-8">
            <HomeCard
                img="/icons/add-meeting.svg"
                title="New Meeting"
                description="Start an instant meeting"
                handleClick={() => setMeetingState('isInstantMeeting')}
                className="bg-gradient-to-br from-[#ee0979] to-[#ff6a00]"
            />
            <HomeCard
                img="/icons/schedule.svg"
                title="Schedule Meeting"
                description="Plan your meeting"
                handleClick={() => setMeetingState('isScheduleMeeting')}
                className="bg-gradient-to-br from-[#FC466B] to-[#3F5EFB]"
            />
            <HomeCard
                img="/icons/recordings.svg"
                title="View Recordings"
                description="Check out your recordings"
                handleClick={() => router.push('/recordings')}
                className="bg-gradient-to-br from-[#F0CB35] to-[#C02425]"
            />
            <HomeCard
                img="/icons/join-meeting.svg"
                title="Join Meeting"
                description="via invitation link"
                handleClick={() => setMeetingState('isJoiningMeeting')}
                className="from-[#12c2e9] via-[#c471ed] to-[#f64f59]"
            />

            {!callDetails ? (
                <MeetingModal
                    isOpen={meetingState === 'isScheduleMeeting'}
                    onClose={() => setMeetingState(undefined)}
                    title="Create Meeting"
                    handleCLick={createMeeting}
                    buttonClass='bg-gradient-to-br from-[#FC466B] to-[#3F5EFB]'
                >
                    <div className="flex flex-col gap-2 5">
                        <label className='text-base text-normal leading-[22px] text-sky-2'>Add a description</label>
                        <Textarea className='border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0'
                            onChange={(e) => {
                                setvalues({ ...values, description: e.target.value })
                            }} />
                    </div>
                    <div className="flex flex-col w-full gap-2 5">
                        <label className='text-base text-normal leading-[22px] text-sky-2'>Select Date and Time</label>
                        <ReactDatePicker
                            selected={values.dateTime}
                            onChange={(date) => setvalues({ ...values, dateTime: date! })}
                            showTimeSelect
                            timeFormat='HH:mm'
                            timeIntervals={15}
                            timeCaption='time'
                            dateFormat="MMMM d, yyyy h:mm aa"
                            className='w-full rounded bg-dark-3 p-2 focus:outline-none'
                        />
                    </div>
                </MeetingModal>
            ) : (
                <MeetingModal
                    isOpen={meetingState === 'isScheduleMeeting'}
                    onClose={() => setMeetingState(undefined)}
                    title="Meeting Created"
                    className="text-center"
                    handleCLick={() => {
                        navigator.clipboard.writeText(meetingLink);
                        toast({ title: 'Link Copied' })
                    }}
                    buttonIcon='/icons/copy.svg'
                    buttonText='Copy Meeting Link'
                    buttonClass='bg-gradient-to-br from-[#FC466B] to-[#3F5EFB]'
                />
            )}
            <MeetingModal
                isOpen={meetingState === 'isInstantMeeting'}
                onClose={() => setMeetingState(undefined)}
                title="Start an Instant Meeting"
                className="text-center"
                buttonText="Start Meeting"
                handleCLick={createMeeting}
                buttonClass='bg-gradient-to-br from-[#ee0979] to-[#ff6a00]'
            />

            <MeetingModal
                isOpen={meetingState === 'isJoiningMeeting'}
                onClose={() => setMeetingState(undefined)}
                title="Type/Paste the link here"
                className="text-center"
                buttonText="Join Meeting"
                handleCLick={() => router.push(values.link)}
                buttonClass='from-[#12c2e9] via-[#c471ed] to-[#f64f59]'
            >
                <Input 
                    placeholder='Meeting Link'
                    className='border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0'
                    onChange={(e) => setvalues({...values, link: e.target.value})}
                />
            </MeetingModal>


        </section>
    )
}

export default MeetingTypeList