/**
 * Java Package Database — JDK standard library + Spring/Apache/Guava.
 *
 * Used for hallucinated import detection in offline mode
 * (when Maven Central is not available).
 *
 * @since 0.5.0
 */

export const JAVA_STANDARD_LIBRARY = new Set([
  'java.lang', 'java.lang.annotation', 'java.lang.constant', 'java.lang.foreign',
  'java.lang.invoke', 'java.lang.management', 'java.lang.ref', 'java.lang.reflect',
  'java.lang.runtime', 'java.lang.thread',
  'java.io', 'java.nio', 'java.nio.channels', 'java.nio.channels.spi',
  'java.nio.charset', 'java.nio.charset.spi', 'java.nio.file', 'java.nio.file.attribute',
  'java.nio.file.spi',
  'java.util', 'java.util.concurrent', 'java.util.concurrent.atomic',
  'java.util.concurrent.locks', 'java.util.function', 'java.util.jar',
  'java.util.logging', 'java.util.prefs', 'java.util.regex', 'java.util.spi',
  'java.util.stream', 'java.util.zip',
  'java.math', 'java.math.BigInteger', 'java.math.BigDecimal',
  'java.net', 'java.net.http', 'java.net.spi',
  'java.security', 'java.security.acl', 'java.security.cert',
  'java.security.interfaces', 'java.security.spec',
  'java.sql', 'java.sql.rowset', 'java.sql.rowset.serial', 'java.sql.rowset.spi',
  'java.time', 'java.time.chrono', 'java.time.format', 'java.time.temporal',
  'java.time.zone',
  'java.text', 'java.text.spi',
  'javax.sql', 'javax.transaction', 'javax.transaction.xa',
  'javax.xml', 'javax.xml.parsers', 'javax.xml.transform', 'javax.xml.transform.dom',
  'javax.xml.transform.sax', 'javax.xml.transform.stax', 'javax.xml.transform.stream',
  'javax.xml.validation', 'javax.xml.xpath',
  'javax.net', 'javax.net.ssl',
  'javax.management', 'javax.management.openmbean', 'javax.management.timer',
  'javax.naming', 'javax.naming.directory', 'javax.naming.event', 'javax.naming.ldap',
  'javax.script',
  'javax.crypto', 'javax.crypto.spec',
  'javax.imageio', 'javax.imageio.event', 'javax.imageio.metadata', 'javax.imageio.plugins.jpeg',
  'javax.imageio.plugins.bmp', 'javax.imageio.plugins.tiff', 'javax.imageio.spi', 'javax.imageio.stream',
  'javax.sound.midi', 'javax.sound.midi.spi', 'javax.sound.sampled', 'javax.sound.sampled.spi',
  'javax.print', 'javax.print.attribute', 'javax.print.attribute.standard',
  'javax.print.event',
  'javax.swing', 'javax.swing.border', 'javax.swing.colorchooser', 'javax.swing.event',
  'javax.swing.filechooser', 'javax.swing.plaf', 'javax.swing.plaf.basic',
  'javax.swing.plaf.metal', 'javax.swing.plaf.multi', 'javax.swing.plaf.synth',
  'javax.swing.table', 'javax.swing.text', 'javax.swing.text.html',
  'javax.swing.text.html.parser', 'javax.swing.text.rtf',
  'javax.swing.tree', 'javax.swing.undo',
  'javax.accessibility',
  'java.awt', 'java.awt.color', 'java.awt.datatransfer', 'java.awt.dnd',
  'java.awt.event', 'java.awt.font', 'java.awt.geom', 'java.awt.im',
  'java.awt.im.spi', 'java.awt.image', 'java.awt.image.renderable',
  'java.awt.print',
]);

/**
 * Common Java third-party packages (groupId).
 */
export const JAVA_THIRD_PARTY = new Set([
  // Spring Framework
  'org.springframework', 'org.springframework.boot', 'org.springframework.context',
  'org.springframework.web', 'org.springframework.web.bind', 'org.springframework.web.servlet',
  'org.springframework.http', 'org.springframework.beans', 'org.springframework.core',
  'org.springframework.data', 'org.springframework.security', 'org.springframework.security.core',
  'org.springframework.security.crypto', 'org.springframework.security.web',
  'org.springframework.jdbc', 'org.springframework.orm', 'org.springframework.transaction',
  'org.springframework.aop', 'org.springframework.test', 'org.springframework.cache',
  'org.springframework.messaging', 'org.springframework.web.socket',
  'org.springframework.kafka', 'org.springframework.amqp', 'org.springframework.cloud',
  'org.springframework.integration', 'org.springframework.batch', 'org.springframework.scheduling',
  'org.springframework.validation', 'org.springframework.retry', 'org.springframework.util',
  'org.springframework.ui', 'org.springframework.format', 'org.springframework.graphql',
  'org.springframework.boot.autoconfigure', 'org.springframework.boot.test',

  // Apache Commons
  'org.apache.commons', 'org.apache.commons.lang3', 'org.apache.commons.collections4',
  'org.apache.commons.io', 'org.apache.commons.codec', 'org.apache.commons.text',
  'org.apache.commons.compress', 'org.apache.commons.csv', 'org.apache.commons.exec',
  'org.apache.commons.fileupload', 'org.apache.commons.httpclient',
  'org.apache.commons.lang', 'org.apache.commons.collections',
  'org.apache.commons.math3', 'org.apache.commons.math4',
  'org.apache.commons.configuration2', 'org.apache.commons.dbcp2',
  'org.apache.commons.pool2', 'org.apache.commons.logging',
  'org.apache.commons.beanutils', 'org.apache.commons.digester3',

  // Google / Guava
  'com.google.guava', 'com.google.common',
  'com.google.code.gson', 'com.google.code.findbugs', 'com.google.protobuf',
  'com.google.errorprone', 'com.google.auto.value', 'com.google.auto.service',
  'com.google.inject', 'com.google.http-client', 'com.google.oauth-client',
  'com.google.api-client', 'com.google.auth',
  'com.google.firebase', 'com.google.cloud', 'com.google.material',
  'com.google.j2objc',

  // Jackson
  'com.fasterxml.jackson', 'com.fasterxml.jackson.core', 'com.fasterxml.jackson.databind',
  'com.fasterxml.jackson.datatype', 'com.fasterxml.jackson.dataformat',
  'com.fasterxml.jackson.annotation', 'com.fasterxml.jackson.module',

  // Database
  'org.hibernate', 'org.hibernate.validator', 'org.hibernate.orm',
  'org.mybatis', 'org.mybatis.spring', 'org.jooq', 'org.jooq.impl',
  'com.zaxxer.hikari', 'mysql', 'mysql.connector', 'org.postgresql',
  'org.xerial', 'org.mongodb', 'com.datastax.oss', 'redis.clients',
  'org.elasticsearch', 'org.liquibase', 'org.flywaydb',
  'com.querydsl', 'io.ebean',

  // Testing
  'org.junit', 'org.junit.jupiter', 'org.junit.jupiter.api', 'org.junit.jupiter.params',
  'org.junit.platform', 'org.junit.platform.commons',
  'org.mockito', 'org.mockito.junit', 'org.mockito.stubbing',
  'org.assertj', 'org.hamcrest', 'org.hamcrest.core', 'org.hamcrest.beans',
  'org.testng',

  // Logging
  'org.slf4j', 'ch.qos.logback', 'org.apache.logging', 'org.apache.logging.log4j',
  'org.apache.log4j', 'log4j',

  // Web / REST
  'io.vertx', 'io.javalin', 'io.dropwizard', 'io.micronaut', 'io.quarkus',
  'io.swagger', 'io.swagger.v3', 'org.glassfish.jersey',
  'org.jboss.resteasy', 'org.apache.cxf',
  'javax.ws.rs', 'jakarta.ws.rs', 'javax.servlet', 'jakarta.servlet',

  // Jakarta EE
  'jakarta.persistence', 'jakarta.validation', 'jakarta.annotation',
  'jakarta.inject', 'jakarta.enterprise', 'jakarta.transaction',
  'jakarta.xml.bind', 'jakarta.mail', 'jakarta.servlet',
  'jakarta.ws.rs', 'jakarta.security',

  // Misc
  'org.projectlombok', 'lombok', 'org.mapstruct',
  'io.netty', 'io.grpc', 'io.opentelemetry',
  'com.squareup.okhttp', 'com.squareup.okhttp3', 'com.squareup.retrofit2',
  'com.squareup.moshi', 'com.squareup.dagger', 'dagger',
  'org.apache.kafka', 'org.apache.httpcomponents', 'org.apache.http',
  'org.apache.tika', 'org.apache.lucene', 'org.apache.poi',
  'org.apache.maven', 'org.apache.ivy', 'org.apache.ant',
  'org.eclipse.jetty', 'org.eclipse.jgit',
  'com.rabbitmq', 'com.amazonaws', 'software.amazon.awssdk',
  'com.azure', 'com.azure.core', 'com.azure.identity', 'com.azure.storage',
  'com.nimbusds', 'org.bouncycastle', 'com.google.zxing',
  'org.jsoup', 'org.json', 'com.jayway.jsonpath',
  'io.jsonwebtoken', 'com.auth0', 'org.keycloak',
  'com.google.common.base', 'com.google.common.collect',
  'com.google.common.util.concurrent', 'com.google.common.io',
  'com.google.common.cache', 'com.google.common.hash',
  'com.google.common.primitives', 'com.google.common.net',
]);

/** Combined Java package set. */
export const JAVA_ALL_KNOWN_PACKAGES = new Set([
  ...JAVA_STANDARD_LIBRARY,
  ...JAVA_THIRD_PARTY,
]);
