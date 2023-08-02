import { NextResponse } from "next/server";


export async function POST(req) {
  try {
    const { page } = await req.json();
    console.log(page,"Api called");

    const url = `https://api.unsplash.com/photos/random?count=10&page=${page}&client_id=${process.env.ACCESS_KEY}`;
    // const url = `https://picsum.photos/v2/list?page=${page}&limit=10`;
    const result = await fetch(url);
    const data = await result.json();

    return NextResponse.json(data);
  } catch (error) {
    console.log("ERROR", error);
    return new NextResponse(error, { status: 500 });
  }
}
