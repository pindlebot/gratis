const REQUIRE_REGEX = /(?<=(require|from|import)\s?\(?["'])([^'"\s]+)(?=['"]\)?)/

module.exports.REQUIRE_REGEX = REQUIRE_REGEX
