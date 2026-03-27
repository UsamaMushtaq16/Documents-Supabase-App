import { useEffect, useState } from 'react'
import { fetchDocuments } from '../services/documentService'

export const useDocuments = () => {
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)

  const loadDocuments = async () => {
    setLoading(true)
    const data = await fetchDocuments()
    setDocuments(data)
    setLoading(false)
  }

  useEffect(() => {
    loadDocuments()
  }, [])

  return { documents, loading, reload: loadDocuments }
}