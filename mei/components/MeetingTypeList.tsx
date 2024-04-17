'use client'

import React, { useState } from 'react'
import HomeCard from '@/components/HomeCard'
import { useRouter } from 'next/navigation'
import MeetingModal from '@/components/MeetingModal'
import { useUser } from '@clerk/nextjs'
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk'
import { useToast } from "@/components/ui/use-toast"


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

            if(!values.dateTime) {
                toast({title: "Please select a date and time", })
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

            if(!values.description) {
                router.push(`/meeting/${call.id}`)
            }

            toast({title: "Meeting Created", })
        } catch (error) {
            console.log(error);
            toast({title: "Failed to create meeting", })
        }
    }

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

            <MeetingModal
                isOpen={meetingState === 'isInstantMeeting'}
                onCLose={() => setMeetingState(undefined)}
                title="Start an Instant Meeting"
                className="text-center"
                buttonText="Start Meeting"
                handleCLick={createMeeting}
                buttonClass='bg-gradient-to-br from-[#ee0979] to-[#ff6a00]'
            />
        </section>
    )
}

export default MeetingTypeList