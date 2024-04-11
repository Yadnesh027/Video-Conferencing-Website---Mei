'use client'

import React, { useState } from 'react'
import HomeCard from '@/components/HomeCard'
import router from 'next/router'

const MeetingTypeList = () => {
    const [meetingState, setMeetingState] = useState<'isScheduleMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | undefined>()

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
    </section>
  )
}

export default MeetingTypeList