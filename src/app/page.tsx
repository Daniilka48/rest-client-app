import Link from "next/link";

export default function MainPageMock() {
  const isLoggedIn = false;

  return (
    <div>
      <header style={{ display: "flex", justifyContent: "space-between", padding: "1rem" }}>
        <h1>REST Client</h1>
        <div>
          {isLoggedIn ? (
            <Link href="/rest-client">Main Page</Link>
          ) : (
            <>
              <Link href="/sign-in">Sign In</Link>{" | "}
              <Link href="/sign-up">Sign Up</Link>
            </>
          )}
        </div>
      </header>

      <main style={{ padding: "1rem" }}>
        <h2>Welcome to the REST Client App</h2>
        <p>Project: REST Client</p>
        <p>Course: Stage 3 React</p>
        <p>Developers: Team Names</p>
      </main>
    </div>
  );
}