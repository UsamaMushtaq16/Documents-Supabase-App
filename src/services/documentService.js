import { supabase } from './supabaseClient'
import { getUser } from './authService'

export const uploadFile = async (file) => {
  const user = await getUser()
  const fileName = `${user.id}/${Date.now()}-${file.name}`

  const { error } = await supabase.storage
    .from('documents')
    .upload(fileName, file)

  if (error) throw error

  const { data, error: urlError } = await supabase.storage
    .from('documents')
    .createSignedUrl(fileName, 60 * 60 * 24 * 7) // 7 days

  if (urlError) throw urlError

  return data.signedUrl
}

export const saveDocument = async (title, fileUrl, userId) => {
  const { error } = await supabase.from('documents').insert([
    { title, file_url: fileUrl, user_id: userId }
  ])
  if (error) throw error
}

export const fetchDocuments = async () => {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export const deleteDocument = async (id, filePath) => {
  const { error: storageError } = await supabase.storage
    .from('documents')
    .remove([filePath])
  if (storageError) throw storageError

  const { error: dbError } = await supabase
    .from('documents')
    .delete()
    .eq('id', id)
  if (dbError) throw dbError
}