import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Code, FileText, Database, Server, Monitor } from 'lucide-react';

const EmployeeSearchFlow = () => {
  const [expandedSections, setExpandedSections] = useState({});
  const [selectedLine, setSelectedLine] = useState(null);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const sections = [
    {
      id: 'step1',
      title: 'ステップ1: 検索画面表示 (FindEmployeeView.jsp)',
      icon: <Monitor className="w-4 h-4" />,
      code: [
        { line: '<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" %>', explain: 'JSPページの文字エンコーディングをUTF-8に設定。日本語を正しく表示するために必要' },
        { line: '<%@ taglib uri="jakarta.tags.core" prefix="c" %>', explain: 'JSTLのcoreタグライブラリを使用宣言。c:outタグなどが使えるようになる' },
        { line: '<!DOCTYPE html>', explain: 'HTML5文書であることを宣言' },
        { line: '<html>', explain: 'HTML文書の開始' },
        { line: '<head>', explain: 'ヘッダー部分の開始' },
        { line: '<meta charset="UTF-8">', explain: 'HTMLの文字エンコーディングをUTF-8に指定' },
        { line: '<title>従業員検索</title>', explain: 'ブラウザのタブに表示されるタイトル' },
        { line: '</head>', explain: 'ヘッダー部分の終了' },
        { line: '<body>', explain: 'ボディ部分の開始（実際に画面に表示される内容）' },
        { line: '<div style="text-align:center">', explain: '中央寄せのためのdivタグ開始' },
        { line: ' <h2>従業員検索画面</h2>', explain: '画面のタイトルを大きく表示' },
        { line: ' 従業員番号を入力して、検索ボタンをクリックしてください。', explain: 'ユーザーへの操作説明' },
        { line: ' <div style="text-align:center; color:red; font-weight:bold;">', explain: 'エラーメッセージ表示用のdiv（赤色・太字）' },
        { line: '   <c:out value="${requestScope.errorMessage}" />', explain: 'サーブレットから送られたエラーメッセージを表示（XSS対策済み）' },
        { line: ' </div>', explain: 'エラーメッセージ用divの終了' },
        { line: ' <div style="text-align:center">', explain: 'フォーム部分を中央寄せするdiv' },
        { line: '  <form action="/javasys_samples/findEmployeeMVC" method="post">', explain: 'フォームの開始。送信先はFindEmployeeServletMVC、POSTメソッドで送信' },
        { line: '    従業員番号：<input type="number" name="empId" maxlength="6" value="<c:out value="${ param.empId }"/>">', explain: '数値入力欄。name="empId"でサーブレットに送信。前回の入力値を保持' },
        { line: '    <br>', explain: '改行' },
        { line: '    <input type="submit" value="検索">', explain: '検索ボタン。クリックでフォームを送信' },
        { line: '  </form>', explain: 'フォームの終了' },
        { line: ' </div>', explain: 'フォーム用divの終了' },
        { line: '</div>', explain: '外側のdivの終了' },
        { line: '</body>', explain: 'ボディ部分の終了' },
        { line: '</html>', explain: 'HTML文書の終了' }
      ]
    },
    {
      id: 'step2',
      title: 'ステップ2: サーブレット処理 (FindEmployeeServletMVC.java)',
      icon: <Server className="w-4 h-4" />,
      code: [
        { line: 'package javasys.employee.web;', explain: 'パッケージ宣言。Webレイヤーのクラスであることを示す' },
        { line: 'import java.io.IOException;', explain: '入出力例外処理のためのインポート' },
        { line: 'import jakarta.servlet.RequestDispatcher;', explain: 'JSPへの転送を行うためのインポート' },
        { line: 'import jakarta.servlet.ServletException;', explain: 'サーブレット例外処理のためのインポート' },
        { line: 'import jakarta.servlet.annotation.WebServlet;', explain: 'URLマッピングアノテーションのインポート' },
        { line: 'import jakarta.servlet.http.HttpServlet;', explain: 'HTTPサーブレットの基底クラス' },
        { line: 'import jakarta.servlet.http.HttpServletRequest;', explain: 'HTTPリクエストオブジェクト' },
        { line: 'import jakarta.servlet.http.HttpServletResponse;', explain: 'HTTPレスポンスオブジェクト' },
        { line: 'import javasys.employee.common.EmployeeBusinessException;', explain: '業務エラー例外クラス' },
        { line: 'import javasys.employee.common.EmployeeSystemException;', explain: 'システムエラー例外クラス' },
        { line: 'import javasys.employee.entity.Employee;', explain: '従業員エンティティクラス' },
        { line: 'import javasys.employee.logic.EmployeeFindLogic;', explain: '従業員検索ロジッククラス' },
        { line: '', explain: '空行' },
        { line: '@WebServlet(urlPatterns = { "/findEmployeeMVC" })', explain: 'URLパターンを定義。/findEmployeeMVCでアクセス可能に' },
        { line: 'public class FindEmployeeServletMVC extends HttpServlet {', explain: 'サーブレットクラスの定義開始' },
        { line: '    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {', explain: 'POSTリクエスト処理メソッド。フォームからのデータを受け取る' },
        { line: '        // 遷移先ページ名の設定', explain: 'コメント：遷移先を管理' },
        { line: '        String page = "/jsp/FindEmployeeResultView.jsp";', explain: 'デフォルトの遷移先を結果表示画面に設定' },
        { line: '        try {', explain: '例外処理の開始' },
        { line: '            // パラメータの取得', explain: 'コメント：フォームデータ取得処理' },
        { line: '            request.setCharacterEncoding("UTF-8");', explain: 'リクエストの文字エンコーディングをUTF-8に設定（文字化け防止）' },
        { line: '            String empId = request.getParameter("empId");', explain: 'フォームから送信された従業員番号を取得' },
        { line: '', explain: '空行' },
        { line: '            // パラメータ未送信または未入力の場合', explain: 'コメント：入力チェック処理' },
        { line: '            // EmployeeBusinessExceptionをスローする', explain: 'コメント：エラー処理の説明' },
        { line: '            if (empId == null || empId.equals("")) {', explain: '従業員番号が未入力かチェック' },
        { line: '                throw new EmployeeBusinessException("従業員番号が未入力です。");', explain: '業務例外を投げる（エラーメッセージ付き）' },
        { line: '            }', explain: 'if文の終了' },
        { line: '', explain: '空行' },
        { line: '            // 業務Logic呼び出し', explain: 'コメント：ビジネスロジック実行' },
        { line: '            EmployeeFindLogic logic = new EmployeeFindLogic();', explain: '検索ロジッククラスのインスタンス生成' },
        { line: '            Employee employee = logic.findEmployeeById(Integer.parseInt(empId));', explain: '従業員番号を整数に変換して検索実行。結果をEmployeeオブジェクトで受け取る' },
        { line: '', explain: '空行' },
        { line: '            // 処理結果の格納', explain: 'コメント：検索結果の保存' },
        { line: '            request.setAttribute("employee", employee);', explain: '検索結果をリクエスト属性に格納（JSPで使用するため）' },
        { line: '        } catch (EmployeeBusinessException e) {', explain: '業務エラーの捕捉' },
        { line: '            // 業務エラー発生時', explain: 'コメント：業務エラー処理' },
        { line: '            // エラーメッセージの格納', explain: 'コメント：エラー情報の保存' },
        { line: '            request.setAttribute("errorMessage", e.getMessage());', explain: 'エラーメッセージをリクエスト属性に格納' },
        { line: '            // 遷移先ページ名の設定', explain: 'コメント：エラー時の遷移先変更' },
        { line: '            page = "/jsp/FindEmployeeView.jsp";', explain: '検索画面に戻す（エラーメッセージ付き）' },
        { line: '        } catch (EmployeeSystemException e) {', explain: 'システムエラーの捕捉' },
        { line: '            // システムエラー発生時', explain: 'コメント：システムエラー処理' },
        { line: '            // エラーメッセージの格納', explain: 'コメント：エラー情報の保存' },
        { line: '            request.setAttribute("errorMessage", e.getMessage());', explain: 'エラーメッセージをリクエスト属性に格納' },
        { line: '            // 遷移先ページ名の設定', explain: 'コメント：システムエラー時の遷移先' },
        { line: '            page = "/jsp/SystemErrorPage.jsp";', explain: 'システムエラー画面へ遷移' },
        { line: '        }', explain: 'try-catch文の終了' },
        { line: '        // 結果画面に転送', explain: 'コメント：画面遷移処理' },
        { line: '        RequestDispatcher rd = request.getRequestDispatcher(page);', explain: '指定されたJSPへの転送準備' },
        { line: '        rd.forward(request, response);', explain: 'JSPへ転送実行（リクエスト・レスポンスを引き継ぐ）' },
        { line: '    }', explain: 'doPostメソッドの終了' },
        { line: '}', explain: 'クラスの終了' }
      ]
    },
    {
      id: 'step3',
      title: 'ステップ3: ビジネスロジック (EmployeeFindLogic.java)',
      icon: <Code className="w-4 h-4" />,
      code: [
        { line: 'package javasys.employee.logic;', explain: 'パッケージ宣言。ビジネスロジック層' },
        { line: 'import java.sql.Connection;', explain: 'データベース接続オブジェクトのインポート' },
        { line: 'import java.sql.SQLException;', explain: 'SQL例外クラスのインポート' },
        { line: 'import javasys.employee.common.EmployeeBusinessException;', explain: '業務例外クラスのインポート' },
        { line: 'import javasys.employee.common.EmployeeSystemException;', explain: 'システム例外クラスのインポート' },
        { line: 'import javasys.employee.dao.ConnectionManager;', explain: 'DB接続管理クラスのインポート' },
        { line: 'import javasys.employee.dao.EmployeeDAO;', explain: '従業員DAOクラスのインポート' },
        { line: 'import javasys.employee.entity.Employee;', explain: '従業員エンティティのインポート' },
        { line: '', explain: '空行' },
        { line: 'public class EmployeeFindLogic {', explain: 'ロジッククラスの定義開始' },
        { line: '    /**', explain: 'JavaDocコメントの開始' },
        { line: '     * 従業員を検索する。', explain: 'メソッドの説明' },
        { line: '     * @param empId 従業員番号', explain: 'パラメータの説明' },
        { line: '     * @return 従業員', explain: '戻り値の説明' },
        { line: '     * @throws EmployeeBusinessException 業務エラーが発生した場合', explain: '業務例外の説明' },
        { line: '     * @throws EmployeeSystemException システムエラーが発生した場合', explain: 'システム例外の説明' },
        { line: '     */', explain: 'JavaDocコメントの終了' },
        { line: '    public Employee findEmployeeById(int empId)', explain: 'public：どこからでもアクセス可能、戻り値：Employeeオブジェクト、引数：従業員番号（整数）' },
        { line: '            throws EmployeeBusinessException, EmployeeSystemException {', explain: '投げる可能性のある例外を宣言' },
        { line: '        Connection con = null;', explain: 'DB接続オブジェクトを初期化（最初はnull）' },
        { line: '        Employee employee = null;', explain: '検索結果格納用の変数を初期化' },
        { line: '        try {', explain: '例外処理の開始' },
        { line: '            // データベースの接続を取得する', explain: 'コメント：DB接続処理' },
        { line: '            con = ConnectionManager.getConnection();', explain: 'ConnectionManagerからDB接続を取得' },
        { line: '', explain: '空行' },
        { line: '            // DAOを生成し、メソッドを呼び出す', explain: 'コメント：DAO実行処理' },
        { line: '            EmployeeDAO employeeDAO = new EmployeeDAO(con);', explain: 'DAOインスタンスを生成（DB接続を渡す）' },
        { line: '            employee = employeeDAO.findEmployeeById(empId);', explain: 'DAOの検索メソッドを呼び出し、結果を受け取る' },
        { line: '', explain: '空行' },
        { line: '            // 検索結果がない場合、業務エラーを発生させる', explain: 'コメント：検索結果チェック' },
        { line: '            if (employee == null) {', explain: '従業員が見つからなかった場合' },
        { line: '                throw new EmployeeBusinessException("従業員番号："', explain: '業務例外を投げる（メッセージ開始）' },
        { line: '                                        + empId + "は、存在しません。");', explain: '従業員番号を含むエラーメッセージ' },
        { line: '            }', explain: 'if文の終了' },
        { line: '        } catch (SQLException e) {', explain: 'SQL例外（DB関連エラー）を捕捉' },
        { line: '            // データベースエラーの場合、システムエラーを発生させる', explain: 'コメント：DBエラー処理' },
        { line: '            throw new EmployeeSystemException("システムエラーが発生しました。管理者に連絡してください。");', explain: 'システム例外に変換して投げる' },
        { line: '        } finally {', explain: '必ず実行される処理（リソースの解放）' },
        { line: '            try {', explain: 'クローズ処理の例外捕捉開始' },
        { line: '                if (con != null) {', explain: 'DB接続が存在する場合' },
        { line: '                    con.close();', explain: 'DB接続をクローズ（重要：リソースリーク防止）' },
        { line: '                }', explain: 'if文の終了' },
        { line: '            } catch (SQLException e) {', explain: 'クローズ時のSQL例外を捕捉' },
        { line: '                throw new EmployeeSystemException("システムエラーが発生しました。管理者に連絡してください。");', explain: 'クローズエラーもシステム例外として処理' },
        { line: '            }', explain: 'catch文の終了' },
        { line: '        }', explain: 'finally文の終了' },
        { line: '        return employee;', explain: '検索結果のEmployeeオブジェクトを返す' },
        { line: '    }', explain: 'メソッドの終了' },
        { line: '}', explain: 'クラスの終了' }
      ]
    },
    {
      id: 'step4',
      title: 'ステップ4: データアクセス (EmployeeDAO.java - findEmployeeByIdメソッド)',
      icon: <Database className="w-4 h-4" />,
      code: [
        { line: 'public Employee findEmployeeById(int empId) throws SQLException {', explain: '従業員IDで検索するメソッド。SQL例外を投げる可能性を宣言' },
        { line: '    String sql = "SELECT employee_id,employee_name,department_id,phone "', explain: 'SQL文の前半：取得する列を指定' },
        { line: '            + "FROM employee WHERE employee_id = ?";', explain: 'SQL文の後半：employeeテーブルから条件指定。?はプレースホルダー（SQLインジェクション対策）' },
        { line: '    PreparedStatement stmt = null;', explain: 'PreparedStatement（SQL実行用）を初期化' },
        { line: '    ResultSet res = null;', explain: 'ResultSet（検索結果格納用）を初期化' },
        { line: '    Employee employee = null;', explain: '返却用のEmployeeオブジェクトを初期化' },
        { line: '', explain: '空行' },
        { line: '    try {', explain: '例外処理の開始' },
        { line: '        // PreparedStatementの作成', explain: 'コメント：SQL準備' },
        { line: '        stmt = con.prepareStatement(sql);', explain: 'SQL文をプリコンパイル（実行準備）' },
        { line: '        // パラメータの設定', explain: 'コメント：パラメータ設定' },
        { line: '        stmt.setInt(1, empId);', explain: '1番目の?に従業員番号をセット' },
        { line: '        // SQL文の実行', explain: 'コメント：SQL実行' },
        { line: '        res = stmt.executeQuery();', explain: 'SELECT文を実行し、結果をResultSetで受け取る' },
        { line: '        // 結果セットから情報を取り出す', explain: 'コメント：結果取得' },
        { line: '        if (res.next()) {', explain: '結果が存在する場合（nextで1行目に移動）' },
        { line: '            // Employeeオブジェクトの生成', explain: 'コメント：オブジェクト生成' },
        { line: '            employee = new Employee(res.getInt("employee_id"), res.getString("employee_name"),', explain: 'Employeeのコンストラクタ呼び出し開始。IDと名前を取得' },
        { line: '                    res.getInt("department_id"), res.getString("phone"));', explain: '部門IDと電話番号を取得してコンストラクタ完了' },
        { line: '        }', explain: 'if文の終了（結果がない場合はemployeeはnullのまま）' },
        { line: '', explain: '空行' },
        { line: '    } finally {', explain: '必ず実行される処理（リソース解放）' },
        { line: '        // クローズ処理', explain: 'コメント：リソース解放' },
        { line: '        if (res != null) {', explain: 'ResultSetが存在する場合' },
        { line: '            res.close();', explain: 'ResultSetをクローズ（メモリリーク防止）' },
        { line: '        }', explain: 'if文の終了' },
        { line: '        if (stmt != null) {', explain: 'PreparedStatementが存在する場合' },
        { line: '            stmt.close();', explain: 'PreparedStatementをクローズ' },
        { line: '        }', explain: 'if文の終了' },
        { line: '    }', explain: 'finally文の終了' },
        { line: '', explain: '空行' },
        { line: '    return employee;', explain: '検索結果を返す（見つからない場合はnull）' },
        { line: '}', explain: 'メソッドの終了' }
      ]
    },
    {
      id: 'step5',
      title: 'ステップ5: DB接続管理 (ConnectionManager.java)',
      icon: <Database className="w-4 h-4" />,
      code: [
        { line: 'package javasys.employee.dao;', explain: 'パッケージ宣言。データアクセス層' },
        { line: 'import java.sql.Connection;', explain: 'DB接続インターフェースのインポート' },
        { line: 'import java.sql.DriverManager;', explain: 'DBドライバ管理クラスのインポート' },
        { line: 'import java.sql.SQLException;', explain: 'SQL例外クラスのインポート' },
        { line: '', explain: '空行' },
        { line: 'public class ConnectionManager {', explain: 'DB接続管理クラスの定義開始' },
        { line: '', explain: '空行' },
        { line: '    /** データベース接続URL */', explain: 'JavaDocコメント：定数の説明' },
        { line: '    private static final String URL = "jdbc:mysql://localhost:3306/flm";', explain: 'DB接続URL。MySQLのlocalhostの3306番ポート、flmデータベース' },
        { line: '    /** ユーザー名 */', explain: 'JavaDocコメント：定数の説明' },
        { line: '    private static final String USER = "mysql";', explain: 'DBユーザー名' },
        { line: '    /** パスワード */', explain: 'JavaDocコメント：定数の説明' },
        { line: '    private static final String PASSWORD = "mysql";', explain: 'DBパスワード' },
        { line: '', explain: '空行' },
        { line: '    /**', explain: 'JavaDocコメントの開始' },
        { line: '     * データベースの接続を取得する。', explain: 'メソッドの説明' },
        { line: '     * @return データベースの接続', explain: '戻り値の説明' },
        { line: '     */', explain: 'JavaDocコメントの終了' },
        { line: '    public static Connection getConnection() throws SQLException {', explain: 'staticメソッド：インスタンス化不要。SQL例外を投げる可能性' },
        { line: '        Connection con = null;', explain: 'DB接続オブジェクトを初期化' },
        { line: '        try {', explain: '例外処理の開始' },
        { line: '            con = DriverManager.getConnection(URL, USER, PASSWORD);', explain: 'JDBCドライバを使用してDB接続を確立' },
        { line: '        } catch(SQLException e) {', explain: 'SQL例外（接続失敗など）を捕捉' },
        { line: '            e.printStackTrace();', explain: 'エラー内容をコンソールに出力（デバッグ用）' },
        { line: '            throw e;', explain: '例外を再スロー（呼び出し元に通知）' },
        { line: '        }', explain: 'catch文の終了' },
        { line: '', explain: '空行' },
        { line: '        return con;', explain: '確立したDB接続を返す' },
        { line: '    }', explain: 'メソッドの終了' },
        { line: '}', explain: 'クラスの終了' }
      ]
    },
    {
      id: 'step6',
      title: 'ステップ6: エンティティクラス (Employee.java)',
      icon: <FileText className="w-4 h-4" />,
      code: [
        { line: 'package javasys.employee.entity;', explain: 'パッケージ宣言。エンティティ層' },
        { line: 'import java.io.Serializable;', explain: 'シリアライズ可能インターフェース（セッション保存等で必要）' },
        { line: '', explain: '空行' },
        { line: 'public class Employee implements Serializable{', explain: 'Employeeクラスの定義。Serializableを実装' },
        { line: '', explain: '空行' },
        { line: '    /** 従業員番号 */', explain: 'フィールドの説明' },
        { line: '    private int empId;', explain: 'private：カプセル化。従業員番号を保持' },
        { line: '', explain: '空行' },
        { line: '    /** 従業員名 */', explain: 'フィールドの説明' },
        { line: '    private String empName;', explain: '従業員名を保持' },
        { line: '', explain: '空行' },
        { line: '    /** 部門番号 */', explain: 'フィールドの説明' },
        { line: '    private int departmentId;', explain: '部門番号を保持' },
        { line: '', explain: '空行' },
        { line: '    /** 部門名 */', explain: 'フィールドの説明' },
        { line: '    private String departmentName;', explain: '部門名を保持（結合時に使用）' },
        { line: '', explain: '空行' },
        { line: '    /** 内線番号 */', explain: 'フィールドの説明' },
        { line: '    private String phone;', explain: '内線番号を保持' },
        { line: '', explain: '空行' },
        { line: '    /**', explain: 'JavaDocコメントの開始' },
        { line: '     * コンストラクタ（引数なし）', explain: 'デフォルトコンストラクタの説明' },
        { line: '     */', explain: 'JavaDocコメントの終了' },
        { line: '    public Employee() {', explain: '引数なしコンストラクタ（Beanの要件）' },
        { line: '    }', explain: 'コンストラクタの終了' },
        { line: '', explain: '空行' },
        { line: '    /**', explain: 'JavaDocコメントの開始' },
        { line: '     * コンストラクタ:引数で指定した値を設定する。', explain: 'コンストラクタの説明' },
        { line: '     * @param empId 従業員番号', explain: 'パラメータの説明' },
        { line: '     * @param empName 従業員名', explain: 'パラメータの説明' },
        { line: '     * @param departmentId 部門番号', explain: 'パラメータの説明' },
        { line: '     * @param phone 内線番号', explain: 'パラメータの説明' },
        { line: '     */', explain: 'JavaDocコメントの終了' },
        { line: '    public Employee(int empId, String empName, int departmentId, String phone) {', explain: '4つの引数を持つコンストラクタ' },
        { line: '        this.empId = empId;', explain: 'this：インスタンス変数を指定。引数の値を設定' },
        { line: '        this.empName = empName;', explain: '従業員名を設定' },
        { line: '        this.departmentId = departmentId;', explain: '部門番号を設定' },
        { line: '        this.phone = phone;', explain: '内線番号を設定' },
        { line: '    }', explain: 'コンストラクタの終了' },
        { line: '', explain: '空行' },
        { line: '    // 以下、getter/setterメソッド', explain: 'アクセサメソッドの説明' },
        { line: '    public int getEmpId() {', explain: '従業員番号を取得するgetterメソッド' },
        { line: '        return empId;', explain: 'フィールドの値を返す' },
        { line: '    }', explain: 'メソッドの終了' },
        { line: '', explain: '空行' },
        { line: '    public void setEmpId(int empId) {', explain: '従業員番号を設定するsetterメソッド' },
        { line: '        this.empId = empId;', explain: '引数の値をフィールドに設定' },
        { line: '    }', explain: 'メソッドの終了' },
        { line: '    // 他のgetter/setterも同様の構造...', explain: '残りのフィールドも同じパターン' }
      ]
    },
    {
      id: 'step7',
      title: 'ステップ7: 検索結果表示 (FindEmployeeResultView.jsp)',
      icon: <Monitor className="w-4 h-4" />,
      code: [
        { line: '<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" %>', explain: 'JSPページの文字エンコーディング設定' },
        { line: '<%@ taglib uri="jakarta.tags.core" prefix="c" %>', explain: 'JSTLタグライブラリの使用宣言' },
        { line: '<!DOCTYPE html>', explain: 'HTML5文書宣言' },
        { line: '<html>', explain: 'HTML開始' },
        { line: '<head>', explain: 'ヘッダー開始' },
        { line: '<meta charset="UTF-8">', explain: '文字エンコーディング指定' },
        { line: '<title>従業員検索結果</title>', explain: 'タイトル設定' },
        { line: '</head>', explain: 'ヘッダー終了' },
        { line: '<body>', explain: 'ボディ開始' },
        { line: '<div style="text-align:center">', explain: '中央寄せのdiv' },
        { line: ' <h2>従業員検索結果画面</h2>', explain: '画面タイトル' },
        { line: '従業員番号：<c:out value="${ requestScope.employee.empId }" /><br>', explain: 'サーブレットで設定したemployeeオブジェクトのempIdを表示' },
        { line: '従業員名：<c:out value="${ requestScope.employee.empName }" /><br>', explain: 'empNameを表示。c:outはXSS対策済み' },
        { line: '部門番号：<c:out value="${ requestScope.employee.departmentId }" /><br>', explain: 'departmentIdを表示' },
        { line: '内線番号：<c:out value="${ requestScope.employee.phone }" /><br>', explain: 'phoneを表示' },
        { line: '</div>', explain: 'divの終了' },
        { line: '</body>', explain: 'ボディ終了' },
        { line: '</html>', explain: 'HTML終了' }
      ]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">従業員検索システム - 完全コード解説</h1>
      
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">システムの流れ</h2>
        <p className="text-sm">
          1. ユーザーが検索画面で従業員番号を入力<br/>
          2. サーブレットがリクエストを受け取り、入力チェック<br/>
          3. ビジネスロジックがDB接続を取得し、DAOに検索依頼<br/>
          4. DAOがSQLを実行し、結果をEntityに格納<br/>
          5. 検索結果またはエラーメッセージを画面に表示
        </p>
      </div>

      {sections.map((section) => (
        <div key={section.id} className="mb-4 border rounded-lg overflow-hidden">
          <button
            className="w-full p-4 bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-between"
            onClick={() => toggleSection(section.id)}
          >
            <div className="flex items-center gap-2">
              {section.icon}
              <span className="font-semibold">{section.title}</span>
            </div>
            {expandedSections[section.id] ? <ChevronDown /> : <ChevronRight />}
          </button>
          
          {expandedSections[section.id] && (
            <div className="p-4 bg-white">
              <div className="space-y-2">
                {section.code.map((item, index) => (
                  <div
                    key={index}
                    className={`p-2 rounded cursor-pointer transition-colors ${
                      selectedLine === `${section.id}-${index}` 
                        ? 'bg-yellow-100' 
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedLine(`${section.id}-${index}`)}
                  >
                    <div className="font-mono text-sm bg-gray-100 p-2 rounded mb-1">
                      {item.line || <span className="text-gray-400">（空行）</span>}
                    </div>
                    <div className="text-sm text-gray-600 ml-4">
                      → {item.explain}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
      
      <div className="mt-6 p-4 bg-green-50 rounded-lg">
        <h3 className="font-semibold mb-2">💡 重要ポイント</h3>
        <ul className="text-sm space-y-1 list-disc list-inside">
          <li>MVCパターンで責任を分離（View-Controller-Model）</li>
          <li>例外処理で業務エラーとシステムエラーを区別</li>
          <li>PreparedStatementでSQLインジェクション対策</li>
          <li>finallyブロックで確実にリソースをクローズ</li>
          <li>JSTLのc:outタグでXSS対策</li>
        </ul>
      </div>
    </div>
  );
};

export default EmployeeSearchFlow;
