import { embed } from "ai"
import { google } from "@ai-sdk/google"
import { pinconeIndex } from "@/lib/pinecone"




export const generateEmbedding = async (text: string) => {

    const { embedding } = await embed({
        model: google.embeddingModel("text-embedding-004"),
        value: text
    })

    return embedding

}

export const indexCodeBase = async (repoId: string, files: { path: string, content: string }[]) => {

    const vectors = []

    for (const file of files) {

        const content = `File:${file.path}\n\n ${file.content}`

        const truncatedContent = content.slice(0, 8000)

        try {

            const embededContent = await generateEmbedding(truncatedContent)

            vectors.push({
                id: `${repoId}-${file.path.replace(/\//g, '_')}`,
                values: embededContent,
                metadata: {
                    repoId,
                    path: file.path,
                    content: truncatedContent
                }
            })
        } catch (error) {
            console.error("Failed to Embed", error);

        }

        if (vectors.length > 0) {

            const batchSize = 100;

            try {

                for (let i = 0; i < vectors.length; i += batchSize) {

                    const batch = vectors.slice(i, i + batchSize);

                    await pinconeIndex.upsert({ records: batch })


                    console.log("CodeBase Index Completed");


                }
            } catch (error) {
                console.error("Failed to Index the repo", error)
            }

        }



    }
}



export const retriveContext = async (query: string, repoId: string, topK: number = 5) => {

    try {

        const embededQuery = await generateEmbedding(query);

        const results = await pinconeIndex.query({
            vector: embededQuery,
            topK: topK,
            filter: {
                repoId: repoId
            },
            includeMetadata: true
        })

        if (results?.matches) {

            return results.matches.map((match) => match?.metadata?.content).filter(Boolean)
        }
    } catch (error) {
        console.error("Failed to fetch Context", error)
    }






}