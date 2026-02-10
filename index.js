require("dotenv").config()
const express = require("express")
const cors = require("cors")
const axios = require("axios")

const app = express()
app.use(cors())
app.use(express.json())

app.get("/health", (req, res) => {
  res.status(200).json({
    is_success: true,
    official_email: process.env.email
  })
})

app.post("/bfhl", async (req, res) => {
  try {
    const data = req.body
    const keys = Object.keys(data)

    if (keys.length !== 1)
      return res.status(400).json({ is_success: false })

    const key = keys[0]
    const val = data[key]
    let out

    if (key === "fibonacci") {
      if (!Number.isInteger(val) || val < 0) throw 0
      let a = 0, b = 1
      out = []
      for (let i = 0; i < val; i++) {
        out.push(a)
        ;[a, b] = [b, a + b]
      }
    }

    else if (key === "prime") {
      if (!Array.isArray(val)) throw 0
      out = val.filter(n => {
        if (n < 2) return false
        for (let i = 2; i * i <= n; i++)
          if (n % i === 0) return false
        return true
      })
    }

    else if (key === "lcm") {
      if (!Array.isArray(val) || !val.length) throw 0
      const gcd = (x, y) => y ? gcd(y, x % y) : x
      out = val.reduce((x, y) => Math.abs(x * y) / gcd(x, y))
    }

    else if (key === "hcf") {
      if (!Array.isArray(val) || !val.length) throw 0
      const gcd = (x, y) => y ? gcd(y, x % y) : x
      out = val.reduce(gcd)
    }

    else if (key === "AI") {
      if (typeof val !== "string") throw 0
      const r = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
        { contents: [{ parts: [{ text: val }] }] },
        { params: { key: process.env.AI_API_KEY } }
      )
      out = r.data.candidates[0].content.parts[0].text
        .trim().split(/\s+/)[0]
    }

    else return res.status(400).json({ is_success: false })

    res.status(200).json({
      is_success: true,
      official_email: process.env.email,
      data: out
    })

  } catch {
    res.status(400).json({ is_success: false })
  }
})

app.listen(process.env.PORT || 3000)
