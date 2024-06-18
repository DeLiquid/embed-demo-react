"use client";

import { useEffect, useMemo, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Home() {
  const EMBED_URL = "https://app.brewit.ai/embed/chat";
  const workspaceID = process.env.NEXT_PUBLIC_WORKSPACE_ID;
  const resourceID = process.env.NEXT_PUBLIC_RESOURCE_ID;
  const apiKey = process.env.NEXT_PUBLIC_BREWIT_API_KEY;

  const [jwt, setJWT] = useState<string>();

  useEffect(() => {
    // fetch token
    const url = API_URL + "/auth/signin_external";
    fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `${apiKey}`,
      },
      body: JSON.stringify({
        external_id: "<UNIQUE_ID>",
        ttl_seconds: 3600, // 1 hour
        display_name: "<DISPLAY_NAME>",
        email: "<EMAIL>",
        picture: "<PICTURE_URL>",
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setJWT(data.token);
      })
      .catch((error) => {
        console.error("Sign in Error:", error);
      });
  }, [apiKey]);

  const embedURL = useMemo(() => {
    // use jwt, dataset id, and resource id to generate the embed URL
    if (!jwt) return "";
    return `${EMBED_URL}?workspace_id=${workspaceID}&resource_id=${resourceID}&jwt=${jwt}`;
  }, [jwt, workspaceID, resourceID]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 gap-4">
      <h1>Brewit Embed Chat</h1>
      <div className="border rounded-lg w-[500px] h-[600px] p-4 flex items-center justify-center">
        {!embedURL && <p>Loading...</p>}
        <iframe
          src={embedURL}
          style={{
            width: "100%",
            height: "100%",
          }}
        />
      </div>
    </main>
  );
}
