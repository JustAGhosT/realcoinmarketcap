import { type NextRequest, NextResponse } from "next/server"
import { verifyAuth } from "@/src/lib/auth"
import { neon } from "@neondatabase/serverless"
import type { MintRequest, StampNFT } from "@/src/types/nft"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const mintRequest: MintRequest = await request.json()

    // Get stamp details
    const stamps = await sql`
      SELECT * FROM stamps WHERE id = ${mintRequest.stampId}
    `

    if (stamps.length === 0) {
      return NextResponse.json({ error: "Stamp not found" }, { status: 404 })
    }

    const stamp = stamps[0]

    // Mint NFT on Plurality.Network
    const mintResult = await mintOnPluralityNetwork({
      ...mintRequest,
      stamp,
      userId: user.id,
    })

    // Store NFT record in database
    const nftRecord = await sql`
      INSERT INTO stamp_nfts (
        token_id, contract_address, stamp_id, owner_id, metadata, 
        minted_at, transaction_hash, royalties, creator_address, current_owner_address
      ) VALUES (
        ${mintResult.tokenId}, ${mintResult.contractAddress}, ${mintRequest.stampId}, 
        ${user.id}, ${JSON.stringify(mintRequest.metadata)}, ${new Date().toISOString()}, 
        ${mintResult.transactionHash}, ${mintRequest.royaltyPercentage}, 
        ${mintRequest.recipientAddress}, ${mintRequest.recipientAddress}
      )
      RETURNING *
    `

    const nft: StampNFT = {
      id: nftRecord[0].id,
      tokenId: nftRecord[0].token_id,
      contractAddress: nftRecord[0].contract_address,
      stampId: nftRecord[0].stamp_id,
      ownerId: nftRecord[0].owner_id,
      metadata: nftRecord[0].metadata,
      mintedAt: nftRecord[0].minted_at,
      transactionHash: nftRecord[0].transaction_hash,
      isListed: false,
      royalties: nftRecord[0].royalties,
      creatorAddress: nftRecord[0].creator_address,
      currentOwnerAddress: nftRecord[0].current_owner_address,
    }

    return NextResponse.json({ nft })
  } catch (error) {
    console.error("NFT minting error:", error)
    return NextResponse.json({ error: "Failed to mint NFT" }, { status: 500 })
  }
}

async function mintOnPluralityNetwork(params: any) {
  // Plurality.Network integration
  const pluralityApiUrl = process.env.PLURALITY_API_URL || "https://api.plurality.network"
  const apiKey = process.env.PLURALITY_API_KEY

  const mintPayload = {
    recipient: params.recipientAddress,
    metadata: {
      name: params.metadata.name,
      description: params.metadata.description,
      image: params.metadata.image,
      attributes: params.metadata.attributes,
      external_url: params.metadata.external_url,
    },
    royalty_percentage: params.royaltyPercentage,
    collection: "stamp-collection",
  }

  const response = await fetch(`${pluralityApiUrl}/v1/nft/mint`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(mintPayload),
  })

  if (!response.ok) {
    throw new Error("Failed to mint on Plurality.Network")
  }

  return await response.json()
}
