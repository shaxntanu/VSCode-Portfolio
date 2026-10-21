# Freddy behavior engine

This small Rust crate compiles to WebAssembly and handles the companion's
idle-mood thresholds, message-priority decisions, non-repeating message
selection, and fact timing. React keeps the message content, timers, avatar
animation, and rendering.

To rebuild the browser module, install the Rust stable toolchain and add the
`wasm32-unknown-unknown` target, then run `npm run build:freddy-wasm`. The
generated module is copied to `public/wasm/freddy-behavior.wasm` and loaded by
`PortfolioCompanion` in the browser.
