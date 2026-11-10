import type { Title } from '../types'

export type Review = { text: string; name: string; meta: string; initial: string }

export const REVIEWS = {
  title: { a: 'What families and ', b: 'students say' } satisfies Title,
  google: { label: '5.0 on Google · 179 reviews', url: 'https://www.google.com/search?q=Lobo+Jiu+Jitsu+Aurora+IL' },
  carouselLabel: 'Reviews',
  prev: 'Previous review',
  next: 'Next review',
  slideLabel: (k: number, n: number) => `Review ${k} of ${n}`,
  // Real Google reviews (Adryan sent them 10/11/2026): only ones that came through complete and
  // without em dashes, text verbatim, first name + last initial. Google: 5.0 from 179 reviews on 10/11.
  items: [
    { text: "My son and I train at Lobo Jiu-jitsu for almost 3 years. By far, Lobo BJJ is the best school in the Naperville/ Aurora area! I totally recommend it for anyone who wants to learn a strong BJJ! OSS!", name: "Randal M.", meta: "Trains with his son", initial: "R" },
    { text: "Highly recommend! I’m a mom of two young kids and I have no previous martial arts experience. I’ve always wanted to learn self-defense techniques so I tried a class here and loved it! I’ve been training for a few months now and really enjoy the classes! You have fun while getting a great workout!", name: "Therese B.", meta: "Mom of two, adult student", initial: "T" },
    { text: "Love this gym for my youngest. Master Fred and staff are wonderful working with kids and I love seeing their confidence, physical coordination, and skills coming through. A great gym and a great skill for young kids.", name: "Mohammad N.", meta: "Parent", initial: "M" },
    { text: "This is my jiu jitsu family! Professor Fred has created a fun environment with great teammates where I can enjoy pushing myself and improving everyday. If you’re looking for a safe, clean place with good folks to start learning the sport of BJJ, definitely swing by and join us for a practice!", name: "Michael K.", meta: "Adult student", initial: "M" },
    { text: "A gym tailored for women, clean mats, clean restrooms, a respectful instructor, and a high-quality workout! I highly recommend Lobo Team for the whole family!", name: "Janaína R.", meta: "Adult student", initial: "J" },
    { text: "My son absolutely loves coming here! The coaches are amazing with kids and create a fun, positive environment while teaching discipline and confidence. Highly recommend!", name: "Veronica C.", meta: "Parent", initial: "V" },
    { text: "I've been training at Lobo for 4 years. Fred is a fantastic teacher and is focused on the students growth. The community is very welcoming and supportive. Highly recommend.", name: "Joe G.", meta: "Training for 4 years", initial: "J" },
    { text: "Amazing experience last couple of years. Fred is an outstanding BJJ professor/coach. My children love the school, friends and environment.", name: "Hideraldo C.", meta: "Parent", initial: "H" },
  ] satisfies Review[],
}
