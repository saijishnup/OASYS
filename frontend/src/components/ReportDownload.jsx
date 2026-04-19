import { Download } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../api/axios'

export default function ReportDownload({ endpoint, label = 'Download', filename = 'report' }) {
  const handleClick = async () => {
    try {
      await api.get(endpoint)
      toast.success(`${filename} is ready on the server`)
    } catch (error) {
      toast.error(error.message || 'Report download is not available yet')
    }
  }

  return (
    <button onClick={handleClick} className="btn-ghost flex items-center gap-2 text-sm">
      <Download size={14} />
      {label}
    </button>
  )
}
