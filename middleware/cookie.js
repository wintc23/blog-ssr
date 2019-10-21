
export default function ({ req }) {
  if (process.server) {
    process.cookie = req.headers.cookie || ''
  }
}