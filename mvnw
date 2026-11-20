#!/bin/sh
# ----------------------------------------------------------------------------
# Maven Wrapper for Unix (Memory Flip – Master)
# ----------------------------------------------------------------------------
PRG="$0"
while [ -h "$PRG" ]; do
  ls=`ls -ld "$PRG"`
  link=`expr "$ls" : '.*-> \(.*\)$'`
  if expr "$link" : '/.*' > /dev/null; then
    PRG="$link"
  else
    PRG=`dirname "$PRG"`/"$link"
  fi
done
SAVED="`pwd`"
cd "`dirname \"$PRG\"`" >/dev/null
APP_DIR="`pwd -P`"
cd "$SAVED" >/dev/null

if [ -z "$JAVA_HOME" ] || [ ! -x "$JAVA_HOME/bin/java" ]; then
  if [ -x "/usr/bin/java" ]; then
    JAVA_CMD="/usr/bin/java"
  else
    echo "Error: JAVA_HOME is not set and java was not found in PATH." >&2
    exit 1
  fi
else
  JAVA_CMD="$JAVA_HOME/bin/java"
fi

if [ -x "$APP_DIR/.maven/apache-maven-3.9.9/bin/mvn" ]; then
  exec "$APP_DIR/.maven/apache-maven-3.9.9/bin/mvn" "$@"
fi

WRAPPER_JAR="$APP_DIR/.mvn/wrapper/maven-wrapper.jar"
exec "$JAVA_CMD" -Dmaven.multiModuleProjectDirectory="$APP_DIR" -jar "$WRAPPER_JAR" "$@"
