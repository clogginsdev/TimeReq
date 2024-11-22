import Image from 'next/image'

export default function Profile() {
  return (
    <div className="p-2 mb-4">
      <div className="relative w-24 h-24 mx-auto mb-4">
        <Image
          className="rounded-full object-cover shadow-md hover:shadow-lg transition-shadow"
          fill
          src='/images/chris.jpeg'
          alt="Chris Loggins profile image."
        />
      </div>
      <h2 className='font-bold text-2xl text-gray-100 mb-2'>
        Meeting With Chris
      </h2>
      <em className="block text-neutral-400 mb-3">Web Designer & Developer</em>
      <p className='text-neutral-300 text-sm leading-relaxed'>
        Thanks for coming to schedule a meeting with me. After filling
        out the details, I will review your meeting request and send you
        an invite.
      </p>
    </div>
  )
}
