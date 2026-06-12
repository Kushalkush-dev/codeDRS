import React, { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const QueryProvider = ({children}:{children:React.ReactNode}) => {

    const [client] = useState(()=>new QueryClient())
  return (
    <QueryClientProvider client={client}>
        {children}
    </QueryClientProvider>
  )
}

export default QueryProvider