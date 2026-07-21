import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// スタジオ（file://）→ このAPI（digirep.work）→ GitHub の順で反映する。
// クライアントは api.github.com に直接アクセスしないため、環境のallowlist制限を回避できる。
const REPO = process.env.GH_REPO || "digirep-yumoto/testLP";
const FILE_PATH = "public/data/chains.json";
const BRANCH = "main";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status, headers: CORS });
}

export async function POST(request: Request) {
  // 認証（スタジオと共有のトークン）
  const studioToken = process.env.STUDIO_API_TOKEN;
  if (!studioToken) return json({ error: "STUDIO_API_TOKEN が未設定です（Vercel）。" }, 503);
  const auth = request.headers.get("authorization") || "";
  if (auth !== `Bearer ${studioToken}`) return json({ error: "認証に失敗しました。" }, 401);

  // GitHub 書き込み用トークン（サーバー側のみ）
  const ghToken = process.env.GH_TOKEN;
  if (!ghToken) return json({ error: "GH_TOKEN が未設定です（Vercelに設定してください）。" }, 503);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: "JSON の解析に失敗しました。" }, 400);
  }
  const chains = (body as { chains?: unknown })?.chains ?? body;
  if (!Array.isArray(chains)) return json({ error: "chains（配列）が必要です。" }, 400);

  const content = Buffer.from(JSON.stringify(chains, null, 2), "utf8").toString("base64");
  const api = `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`;
  const ghHeaders = {
    Authorization: `Bearer ${ghToken}`,
    Accept: "application/vnd.github+json",
    "Content-Type": "application/json",
    "User-Agent": "DigiRep-Studio",
  };

  try {
    // 既存ファイルの sha を取得
    let sha: string | undefined;
    const cur = await fetch(`${api}?ref=${BRANCH}`, { headers: ghHeaders });
    if (cur.status === 200) {
      const cj = (await cur.json()) as { sha?: string };
      sha = cj.sha;
    } else if (cur.status === 401 || cur.status === 403) {
      return json({ error: "GitHub認証エラー（GH_TOKENの権限を確認してください）。" }, 502);
    }
    const put = await fetch(api, {
      method: "PUT",
      headers: ghHeaders,
      body: JSON.stringify({
        message: "加盟店データ更新（スタジオから反映）",
        content,
        branch: BRANCH,
        ...(sha ? { sha } : {}),
      }),
    });
    if (put.status === 200 || put.status === 201) {
      return json({ ok: true, count: chains.length });
    }
    const e = (await put.json().catch(() => ({}))) as { message?: string };
    return json({ error: `GitHubへの反映に失敗（${put.status}）: ${e.message || ""}` }, 502);
  } catch (err) {
    return json({ error: "通信エラー: " + (err instanceof Error ? err.message : String(err)) }, 502);
  }
}
