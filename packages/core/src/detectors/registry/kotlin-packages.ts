/**
 * Kotlin Package Database — Kotlin stdlib + Ktor/Android.
 *
 * Used for hallucinated import detection in offline mode.
 *
 * @since 0.5.0
 */

export const KOTLIN_STANDARD_LIBRARY = new Set([
  'kotlin', 'kotlin.annotation', 'kotlin.collections', 'kotlin.comparisons',
  'kotlin.contracts', 'kotlin.coroutines', 'kotlin.coroutines.cancellation',
  'kotlin.coroutines.channels', 'kotlin.coroutines.flow', 'kotlin.coroutines.jvm.internal',
  'kotlin.coroutines.intrinsics', 'kotlin.coroutines.resume',
  'kotlin.enums', 'kotlin.experimental', 'kotlin.function', 'kotlin.io',
  'kotlin.jvm', 'kotlin.jvm.functions', 'kotlin.jvm.internal', 'kotlin.jvm.internal.reflect',
  'kotlin.jvm.internal.unsafe', 'kotlin.js', 'kotlin.ju', 'kotlin.lazy',
  'kotlin.math', 'kotlin.native', 'kotlin.native.concurrent',
  'kotlin.properties', 'kotlin.random', 'kotlin.ranges',
  'kotlin.reflect', 'kotlin.reflect.full', 'kotlin.reflect.jvm',
  'kotlin.sequences', 'kotlin.streams', 'kotlin.system', 'kotlin.text',
  'kotlin.time', 'kotlin.concurrent', 'kotlin.jvm.internal.markers',
  'kotlin.experimental.bitwiseOperations',
  'kotlin.random.URandomKt',
  'kotlin.collections.CollectionsKt',
  'kotlin.collections.MapWithDefault',
  'kotlin.text.StringsKt',
]);

/**
 * Common Kotlin third-party packages.
 */
export const KOTLIN_THIRD_PARTY = new Set([
  // Ktor
  'io.ktor', 'io.ktor.server', 'io.ktor.server.application', 'io.ktor.server.auth',
  'io.ktor.server.engine', 'io.ktor.server.netty', 'io.ktor.server.cio',
  'io.ktor.server.routing', 'io.ktor.server.request', 'io.ktor.server.response',
  'io.ktor.server.sessions', 'io.ktor.server.websockets',
  'io.ktor.server.html', 'io.ktor.server.freemarker',
  'io.ktor.server.mustache', 'io.ktor.server.thymeleaf',
  'io.ktor.server.status', 'io.ktor.server.content', 'io.ktor.server.plugins',
  'io.ktor.server.plugins.calllogging', 'io.ktor.server.plugins.cors',
  'io.ktor.server.plugins.csrf', 'io.ktor.server.plugins.dataconversion',
  'io.ktor.server.plugins.defaultheaders', 'io.ktor.server.plugins.partialcontent',
  'io.ktor.server.plugins.conditionalheaders', 'io.ktor.server.plugins.compression',
  'io.ktor.server.plugins.doublereceive', 'io.ktor.server.plugins.hsts',
  'io.ktor.server.plugins.httpsredirect',
  'io.ktor.client', 'io.ktor.client.engine', 'io.ktor.client.engine.cio',
  'io.ktor.client.engine.apache', 'io.ktor.client.engine.okhttp',
  'io.ktor.client.request', 'io.ktor.client.statement', 'io.ktor.client.plugins',
  'io.ktor.client.plugins.contentnegotiation',
  'io.ktor.client.plugins.logging', 'io.ktor.http', 'io.ktor.http.content',
  'io.ktor.serialization', 'io.ktor.serialization.gson',
  'io.ktor.serialization.jackson', 'io.ktor.serialization.kotlinx.json',
  'io.ktor.websocket', 'io.ktor.utils.io',

  // Kotlinx
  'kotlinx.coroutines', 'kotlinx.coroutines.core', 'kotlinx.coroutines.android',
  'kotlinx.coroutines.reactor', 'kotlinx.coroutines.rx2', 'kotlinx.coroutines.rx3',
  'kotlinx.coroutines.debug', 'kotlinx.coroutines.guava', 'kotlinx.coroutines.jdk8',
  'kotlinx.coroutines.slf4j', 'kotlinx.coroutines.test',
  'kotlinx.serialization', 'kotlinx.serialization.json', 'kotlinx.serialization.cbor',
  'kotlinx.serialization.protobuf', 'kotlinx.serialization.properties',
  'kotlinx.datetime', 'kotlinx.collections.immutable',
  'kotlinx.atomicfu', 'kotlinx.html',

  // Android (Jetpack)
  'androidx', 'androidx.appcompat', 'androidx.core', 'androidx.lifecycle',
  'androidx.lifecycle.viewmodel', 'androidx.lifecycle.livedata',
  'androidx.lifecycle.runtime', 'androidx.lifecycle.extensions',
  'androidx.fragment', 'androidx.fragment.app', 'androidx.activity',
  'androidx.constraintlayout', 'androidx.recyclerview', 'androidx.cardview',
  'androidx.swiperefreshlayout', 'androidx.viewpager2',
  'androidx.navigation', 'androidx.navigation.fragment', 'androidx.navigation.ui',
  'androidx.room', 'androidx.room.runtime', 'androidx.room.compiler',
  'androidx.room.rxjava2', 'androidx.room.rxjava3', 'androidx.room.paging',
  'androidx.datastore', 'androidx.datastore.preferences', 'androidx.datastore.preferences.core',
  'androidx.work', 'androidx.work.rxjava2', 'androidx.work.rxjava3',
  'androidx.paging', 'androidx.paging.runtime', 'androidx.paging.rxjava2',
  'androidx.compose', 'androidx.compose.ui', 'androidx.compose.foundation',
  'androidx.compose.material', 'androidx.compose.material3',
  'androidx.compose.runtime', 'androidx.compose.animation',
  'androidx.compose.animation.graphics', 'androidx.compose.layout',
  'androidx.compose.material.icons', 'androidx.compose.material.icons.filled',
  'androidx.compose.material.icons.outlined', 'androidx.compose.ui.graphics',
  'androidx.compose.ui.text', 'androidx.compose.ui.tooling',
  'androidx.compose.ui.tooling.preview', 'androidx.compose.ui.unit',
  'androidx.camera', 'androidx.camera.core', 'androidx.camera.camera2',
  'androidx.camera.lifecycle', 'androidx.camera.view',
  'androidx.biometric', 'androidx.security', 'androidx.security.crypto',
  'androidx.preference', 'androidx.browser', 'androidx.media',
  'androidx.localbroadcastmanager', 'androidx.multidex',
  'androidx.startup', 'androidx.hilt', 'androidx.hilt.navigation.compose',
  'androidx.test', 'androidx.test.ext', 'androidx.test.espresso',
  'androidx.test.runner', 'androidx.test.rules', 'androidx.test.uiautomator',

  // Dependency Injection
  'com.google.dagger', 'com.google.dagger.hilt.android',
  'javax.inject', 'jakarta.inject',
  'org.koin', 'org.koin.android', 'org.koin.android.viewmodel',
  'org.koin.core', 'org.koin.dsl',

  // Retrofit / OkHttp
  'com.squareup.retrofit2', 'com.squareup.okhttp', 'com.squareup.okhttp3',
  'com.squareup.moshi', 'com.squareup.picasso', 'com.squareup.leakcanary',

  // Exposed (Kotlin SQL)
  'org.jetbrains.exposed', 'org.jetbrains.exposed.core',
  'org.jetbrains.exposed.dao', 'org.jetbrains.exposed.jdbc',
  'org.jetbrains.exposed.java-time', 'org.jetbrains.exposed.sql',

  // Misc
  'com.fasterxml.jackson.module.kotlin',
  'com.fasterxml.jackson.datatype',
  'org.slf4j', 'ch.qos.logback', 'io.github.microutils', 'io.mockk',
  'org.junit.jupiter', 'org.junit.jupiter.api', 'org.junit.jupiter.params',
  'org.mockito', 'org.mockito.kotlin', 'org.assertj.core',
  'com.nhaarman.mockitokotlin2', 'org.amshove.kluent',
  'org.jetbrains.kotlinx', 'org.jetbrains.kotlin.cli',
  'com.google.android.material', 'com.google.android.gms',
  'com.google.firebase', 'com.google.firebase.analytics',
  'com.google.firebase.auth', 'com.google.firebase.firestore',
  'com.google.firebase.messaging',
  'org.jetbrains.kotlin', 'org.jetbrains.kotlinx.serialization',
  'com.jakewharton.timber', 'com.airbnb.android', 'com.airbnb.lottie',
  'com.github.bumptech.glide', 'com.github.chrisbanes',
  'com.facebook.stetho', 'com.facebook.drawee',
]);

/** Combined Kotlin package set. */
export const KOTLIN_ALL_KNOWN_PACKAGES = new Set([
  ...KOTLIN_STANDARD_LIBRARY,
  ...KOTLIN_THIRD_PARTY,
]);
