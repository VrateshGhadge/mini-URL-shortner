import { useState } from 'react'
import axios from 'axios'
import { Link, Copy, Check, AlertCircle, Loader2 } from 'lucide-react'



function App() {
  const [ shortUrl, setShortUrl ] = useState('')
  const [ originalUrl, setOriginalUrl ] = useState('')
  const [ isLoading, setIsLoading ] = useState(false)
  const [ copied, setCopied ] = useState(false)
  const [ error, setError ] = useState('')

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    setError('')
    setShortUrl('')
    setCopied(false)

    if(!originalUrl){
      setError("Please enter a valid URL");
      return
    }

    setIsLoading(true)

    try{
      const res = await axios.post('http://localhost:3000/api/shorten', {
        originalUrl: originalUrl
      })

      const newShortCode = res.data.data.shortCode;
      setShortUrl(`http://localhost:3000/${newShortCode}`)

    }catch(err){
      setError(e.res?.data?.msg || 'Something went wrong connecting to the server.');
    }finally{
      setIsLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl)
    setCopied(true)
    setTimeout(()=> setCopied(false), 2000) //resets checkmark after 2 sec
  }


  return (
    <main className="relative isolate min-h-screen w-full overflow-hidden bg-[#07111f] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(94,234,212,0.18),transparent_32%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.16),transparent_30%),radial-gradient(circle_at_bottom,rgba(168,85,247,0.12),transparent_32%)]" />
      <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-size-[72px_72px] mask-[radial-gradient(circle_at_center,black,transparent_82%)]" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl items-center px-6 py-10 lg:px-10">
        <div className="grid w-full items-center gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-14">
          <section className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/7 px-4 py-2 text-sm text-slate-200 shadow-lg shadow-black/10 backdrop-blur-2xl">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-cyan-200">
                <Link size={18} />
              </span>
              Fast, polished link shortening
            </div>

            <h1 className="max-w-xl text-5xl font-semibold tracking-tight text-white text-balance md:text-7xl">
              Short links, presented with style.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300/90">
              Turn long URLs into clean, shareable links with a calmer interface, stronger contrast, and a more premium feel.
            </p>

            <div className="mt-10 flex flex-wrap gap-3 text-sm text-slate-300">
              <span className="rounded-full border border-white/10 bg-white/6 px-4 py-2 backdrop-blur-2xl">Instant shortening</span>
              <span className="rounded-full border border-white/10 bg-white/6 px-4 py-2 backdrop-blur-2xl">One-click copy</span>
              <span className="rounded-full border border-white/10 bg-white/6 px-4 py-2 backdrop-blur-2xl">Cleaner layout</span>
            </div>
          </section>

          <section className="rounded-4xl border border-white/10 bg-slate-950/70 p-6 shadow-[0_30px_90px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:p-8">
            <div className="mb-6 flex items-center justify-between gap-4 border-b border-white/10 pb-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200/80">Create link</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Paste a URL and shorten it</h2>
              </div>
              <div className="hidden h-12 w-12 items-center justify-center rounded-2xl bg-white/8 text-cyan-200 sm:flex">
                <Copy size={20} />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <label className="text-sm font-medium text-slate-200" htmlFor="url-input">
                Original URL
              </label>

              <input
                id="url-input"
                type="url"
                placeholder="https://example.com/very-long-link..."
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/7 px-4 py-4 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/60 focus:bg-white/10 focus:ring-4 focus:ring-cyan-300/10"
                required
              />

              {error && (
                <div className="flex items-center gap-2 rounded-2xl border border-rose-400/25 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-cyan-300 via-sky-400 to-blue-500 px-4 py-4 font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition duration-200 hover:scale-[1.01] hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Shortening...
                  </>
                ) : (
                  'Shorten URL'
                )}
              </button>
            </form>

            {shortUrl && (
              <div className="mt-8 rounded-[1.75rem] border border-cyan-200/15 bg-cyan-400/8 p-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-100/70">
                  Your short link is ready
                </p>

                <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-white/10 bg-slate-950/50 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <a
                    href={shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="truncate font-medium text-cyan-200 transition hover:text-cyan-100 hover:underline"
                  >
                    {shortUrl}
                  </a>

                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/16"
                  >
                    {copied ? (
                      <>
                        <Check size={16} className="text-emerald-300" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy size={16} />
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}

export default App
