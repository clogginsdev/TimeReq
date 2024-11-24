import Image from 'next/image'

export default function Profile() {
  return (
    <div className="p-2 mb-6">
      <div className="relative w-28 h-28 mx-auto mb-6">
        <Image
          className="rounded-full object-cover shadow-xl ring-2 ring-white/10 hover:ring-white/20 transition-all"
          fill
          src='/images/chris.jpeg'
          alt="Chris Loggins profile image."
        />
      </div>
      <h2 className='font-medium text-2xl text-white mb-2 tracking-tight'>
        Meeting With Chris
      </h2>
      <em className="block text-neutral-400 mb-4 font-medium">Software Developer | UI Designer</em>
      <p className='text-neutral-300 text-sm leading-relaxed mx-auto max-w-xs'>
        Thanks for coming to schedule a meeting with me. After filling
        out the details, I will review your meeting request and send you
        an invite.
      </p>
    </div>
  )
}
