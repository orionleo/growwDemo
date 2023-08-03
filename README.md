This is a [Next.js](https://nextjs.org/) project. The website is deployed using vercel on https://groww-demo.vercel.app/

## Getting Started

First, download the code or fork the repository. 

```bash
npm install
```
This is to download the necessary packages.

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
 
This website has two main pages, one is the photo feed section and one is details of each user. 

The images are lazy loaded in view and they are stored in cache in a page wise manner using zustand.

Clicking on a username will lead you to that user's profile where the photos posted by that user can be seen (9 per page). 

Infinite Scroll was implemented on both the pages.
Blurhash placeholders are used as well. 