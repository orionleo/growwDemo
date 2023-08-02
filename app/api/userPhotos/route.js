import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { id, page} = await req.json();
    console.log(id,page)

    const url2 = `https://api.unsplash.com/users/${id}/photos?client_id=${process.env.ACCESS_KEY}&per_page=9&page=${page}`;
    // const url = `https://picsum.photos/v2/list?page=${page}&limit=10`;
    const result2 = await fetch(url2);
    const data2 = await result2.json();

    return NextResponse.json({data2});
    // return NextResponse.json({data:"data"});
  } catch (error) {
    console.log("ERROR", error);
    return new NextResponse(error, { status: 500 });
  }
}
