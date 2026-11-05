#include "movie.hpp"
#include <emscripten/bind.h>
// Embind exposes this same C++ class to the browser. No duplicate JS movie rules.
EMSCRIPTEN_BINDINGS(frame_core) {
    emscripten::class_<frame::Catalog>("Catalog")
        .constructor<bool>()
        .function("add", &frame::Catalog::add)
        .function("restore", &frame::Catalog::restore)
        .function("update", &frame::Catalog::update)
        .function("remove", &frame::Catalog::remove)
        .function("seed", &frame::Catalog::seed)
        .function("query", &frame::Catalog::query)
        .function("stats", &frame::Catalog::stats)
        .function("snapshot", &frame::Catalog::snapshot)
        .function("lastError", &frame::Catalog::lastError);
}
