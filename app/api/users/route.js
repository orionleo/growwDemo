import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { id, page} = await req.json();
    console.log(id,page)

    const url1 = `https://api.unsplash.com/users/${id}?client_id=${process.env.ACCESS_KEY}`;
    
    // const url = `https://picsum.photos/v2/list?page=${page}&limit=10`;
    const result1 = await fetch(url1);
    
    const data1 = await result1.json();
    

    return NextResponse.json({data1});
    return NextResponse.json({data:"data"});
  } catch (error) {
    console.log("ERROR", error);
    return new NextResponse(error, { status: 500 });
  }
}
